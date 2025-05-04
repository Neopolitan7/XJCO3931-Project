import torch
from compressai.zoo import bmshj2018_factorized
model = bmshj2018_factorized(quality=1, pretrained=True).eval()
dummy_input = torch.randn(1, 3, 256, 256)
torch.onnx.export(
    model,
    dummy_input,
    "test.onnx",
    opset_version=11,
    input_names=["input"],
    output_names=["output"],
    # dynamic_axes={
    #     "input": {0: "batch_size", 2: "height", 3: "width"},
    #     "output": {0: "batch_size", 2: "height", 3: "width"},
    # },
)