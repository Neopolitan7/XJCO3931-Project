import math
import sys
import time
from pathlib import Path
import torch
import torch.nn as nn
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms
import compressai
from compressai.ops import compute_padding
from compressai.zoo.image import model_architectures as architectures

input_image_path = "/Users/neopolitan/Downloads/test.png"
output_image_path = "./out/test_out.png"
model_arch = "bmshj2018-factorized-hardswish"
checkpoint_path = "/Users/compressai/checkpoint_best_loss_hs_0.1.pth.tar"
onnx_export_path = "./model_dynamic.onnx"
use_cuda = False

def read_image(filepath: str) -> torch.Tensor:
    img = Image.open(filepath).convert("RGB")
    return transforms.ToTensor()(img)

def load_checkpoint(arch: str, checkpoint_path: str, no_update: bool = False) -> nn.Module:
    checkpoint = torch.load(checkpoint_path, map_location="cpu")
    state_dict = checkpoint
    for key in ["network", "state_dict", "model_state_dict"]:
        if key in checkpoint:
            state_dict = checkpoint[key]
    new_state_dict = {}
    for k, v in state_dict.items():
        if k.startswith("entropy_bottleneck.matrices."):
            idx = k.split(".")[-1]
            new_key = f"entropy_bottleneck._matrix{idx}"
            new_state_dict[new_key] = v
        elif k.startswith("entropy_bottleneck.biases."):
            idx = k.split(".")[-1]
            new_key = f"entropy_bottleneck._bias{idx}"
            new_state_dict[new_key] = v
        elif k.startswith("entropy_bottleneck.factors."):
            idx = k.split(".")[-1]
            new_key = f"entropy_bottleneck._factor{idx}"
            new_state_dict[new_key] = v
        else:
            new_state_dict[k] = v
    model_cls = architectures[arch]
    net = model_cls.from_state_dict(new_state_dict)
    if not no_update:
        net.update(force=True)
    return net.eval()

@torch.no_grad()
def inference(model: nn.Module, x: torch.Tensor) -> (dict, dict):
    x = x.unsqueeze(0)
    h, w = x.size(2), x.size(3)
    pad, unpad = compute_padding(h, w, min_div=2**6)
    x_padded = F.pad(x, pad, mode="constant", value=0)
    start = time.time()
    out_enc = model.compress(x_padded)
    enc_time = time.time() - start
    start = time.time()
    out_dec = model.decompress(out_enc["strings"], out_enc["shape"])
    dec_time = time.time() - start
    out_dec["x_hat"] = F.pad(out_dec["x_hat"], unpad)
    times = {"encoding_time": enc_time, "decoding_time": dec_time}
    return out_dec, times

import torch.onnx

def export_fixed_model_to_onnx(model: torch.nn.Module, onnx_path: str, input_tensor: torch.Tensor):
    torch.onnx.export(
        model,
        input_tensor,
        onnx_path,
        export_params=True,
        opset_version=12,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={
            'input': {0: 'batch_size', 2: 'height', 3: 'width'},
            'output': {0: 'batch_size', 2: 'height', 3: 'width'}
        }
    )

def export_dynamic_model_to_onnx(model: torch.nn.Module, onnx_path: str, input_tensor: torch.Tensor):
    torch.onnx.export(
        model,
        input_tensor,
        onnx_path,
        export_params=True,
        opset_version=12,
        do_constant_folding=True,
        input_names=['input'],
        output_names=['output'],
        dynamic_axes={
            'input': {0: 'batch_size', 2: 'height', 3: 'width'},
            'output': {0: 'batch_size', 2: 'height', 3: 'width'}
        }
    )

def main():
    compressai.set_entropy_coder(compressai.available_entropy_coders()[0])
    model = load_checkpoint(model_arch, checkpoint_path)
    if use_cuda and torch.cuda.is_available():
        model = model.to("cuda")
    if not Path(input_image_path).is_file():
        sys.exit(1)
    x = read_image(input_image_path)
    if use_cuda and torch.cuda.is_available():
        x = x.to("cuda")
    out_dec, times = inference(model, x)
    x_hat = out_dec["x_hat"].squeeze(0).cpu()
    x_hat_img = transforms.ToPILImage()(x_hat.clamp(0, 1))
    output_path = Path(output_image_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    x_hat_img.save(str(output_path))
    onnx_output_path = "./model.onnx"
    export_fixed_model_to_onnx(model, onnx_output_path, x.unsqueeze(0))

if __name__ == "__main__":
    main()
