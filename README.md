# A Web-Based Flexible Image Compressor

This is the final project from the University of Leeds.

The repository includes 2 folders: web, compressai

## web
This folder includes all the files for running the whole website.
The website provides 5 methods to reduce image size:
* traditional image compression (through browser-image-compression.js)
* image-to-svg (through imagetracer.js)
* k-menas
* end-to-end model
* cropping

## compressai
This folder is a modification based on CompressAI.
Main changes includes:
* add a new model - bmshj2018-hardswish
* two files which are used to export the pretrained and trained model to ONNX format
* two saved checkpoint of the model

## Installation

**pip**:

```bash
git clone https://github.com/Neopolitan7/XJCO3931-Project.git
```

Note that: To run the compressai, please follow the instructions of official CompressAI repository:
https://github.com/InterDigitalInc/CompressAI.git

## Authors

* Zeng Yingyuan

## Acknowledgements

- This project uses [CompressAI](https://github.com/InterDigitalInc/CompressAI) .
- This website makes use of the following JavaScript libraries:
* [TensorFlow.js (`tfjs.js`)](https://www.tensorflow.org/js)
* [JSZip 3.10.0](https://cdnjs.com/libraries/jszip)
* [Google Identity Services](https://developers.google.com/identity/gsi/web)
* [browser-image-compression.js](https://github.com/Donaldcwl/browser-image-compression)
* [ImageTracer.js](https://github.com/jankovicsandras/imagetracerjs)
