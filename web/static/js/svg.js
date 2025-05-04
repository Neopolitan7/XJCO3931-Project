let uploadedFiles = [];
let compressedFiles = [];
const links = document.querySelectorAll('.sidebar a');
const basicSettings = document.querySelector('.basic');
const cleanAllButton = document.getElementById('cleanAll');
const modal = document.getElementById('compareModal');
const closeModal = document.querySelector('.close');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
cleanAllButton.addEventListener('click', () => {
    uploadedFiles = [];
    compressedFiles = [];
    updateFileViewer();
    uploaderContainer.style.display = 'flex';
    viewerContainer.style.display = 'none';
});
basicSettings.style.display = 'flex';
const uploaderContainer = document.querySelector('.uploaderContainer');
const viewerContainer = document.querySelector('.viewerContainer');
const iframe = document.querySelector('.iframe');
let allowedTypes = '.png, .jpg, .jpeg, .webp';
uploaderContainer.addEventListener('click', function () {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = allowedTypes;
    fileInput.click();
    fileInput.addEventListener('change', function (event) {
        const files = event.target.files;
        handleFiles(files);
    });
});
iframe.addEventListener('dragover', function (event) {
    event.preventDefault();
    iframe.style.backgroundColor = '#f0f8ff';
});
iframe.addEventListener('dragleave', function (event) {
    event.preventDefault();
    iframe.style.backgroundColor = '#fff';
});
iframe.addEventListener('drop', function (event) {
    event.preventDefault();
    iframe.style.backgroundColor = '#fff';
    const files = event.dataTransfer.files;
    const validFiles = Array.from(files).filter(file => {
        const extension = file.name.split('.').pop().toLowerCase();
        return allowedTypes.split(', ').includes(`.${extension}`);
    });
    if (validFiles.length > 0) {
        handleFiles(validFiles);
    }
});
const reUploadButton = document.getElementById('upload');
reUploadButton.addEventListener('click', function () {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = allowedTypes;
    fileInput.click();
    fileInput.addEventListener('change', function (event) {
        const files = event.target.files;
        handleFiles(files);
    });
});
const dragger1 = document.getElementById('dragger1');
const sizeInput1 = document.getElementById('sizeInput1');
function updateSliderBackground1() {
    const value = dragger1.value;
    const min = parseFloat(dragger1.min);
    const max = parseFloat(dragger1.max);
    const progress = ((value - min) / (max - min)) * 100;
    dragger1.style.background = `linear-gradient(to right, #165dff ${progress}%, #ccc ${progress}%)`;
}
dragger1.addEventListener('input', function () {
    sizeInput1.value = this.value;
    updateSliderBackground1();
});
sizeInput1.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const min = parseFloat(dragger1.min);
        const max = parseFloat(dragger1.max);
        let value = parseFloat(this.value);
        if (isNaN(value)) {
            value = min;
        } else if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        this.value = value;
        dragger1.value = value;
        updateSliderBackground1();
    }
});
updateSliderBackground1();
const dragger2 = document.getElementById('dragger2');
const sizeInput2 = document.getElementById('sizeInput2');
function updateSliderBackground2() {
    const value = dragger2.value;
    const min = parseFloat(dragger2.min);
    const max = parseFloat(dragger2.max);
    const progress = ((value - min) / (max - min)) * 100;
    dragger2.style.background = `linear-gradient(to right, #165dff ${progress}%, #ccc ${progress}%)`;
}
dragger2.addEventListener('input', function () {
    sizeInput2.value = this.value;
    updateSliderBackground2();
});
sizeInput2.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const min = parseFloat(dragger2.min);
        const max = parseFloat(dragger2.max);
        let value = parseFloat(this.value);
        if (isNaN(value)) {
            value = min;
        } else if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        this.value = value;
        dragger2.value = value;
        updateSliderBackground2();
    }
});
updateSliderBackground2();
const dragger3 = document.getElementById('dragger3');
const sizeInput3 = document.getElementById('sizeInput3');
function updateSliderBackground3() {
    const value = dragger3.value;
    const min = parseFloat(dragger3.min);
    const max = parseFloat(dragger3.max);
    const progress = ((value - min) / (max - min)) * 100;
    dragger3.style.background = `linear-gradient(to right, #165dff ${progress}%, #ccc ${progress}%)`;
}
dragger3.addEventListener('input', function () {
    sizeInput3.value = this.value;
    updateSliderBackground3();
});
sizeInput3.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const min = parseFloat(dragger3.min);
        const max = parseFloat(dragger3.max);
        let value = parseFloat(this.value);
        if (isNaN(value)) {
            value = min;
        } else if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        this.value = value;
        dragger3.value = value;
        updateSliderBackground3();
    }
});
updateSliderBackground3();
function updateFileViewer() {
    const viewerItemsContainer = document.querySelector('.viewerItems');
    viewerItemsContainer.innerHTML = '';
    uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.classList.add('viewerItem');
        const fileName = document.createElement('div');
        fileName.classList.add('fileName');
        fileName.textContent = file.name;
        const isCompressed = compressedFiles[index] !== undefined;
        const fileStatus1 = document.createElement('div');
        fileStatus1.classList.add('fileStatus1');
        fileStatus1.textContent = isCompressed ? '已压缩' : '待压缩';
        if (!isCompressed) fileStatus1.classList.add('show');
        const fileStatus2 = document.createElement('div');
        fileStatus2.classList.add('fileStatus2');
        const successStatus = document.createElement('div');
        successStatus.classList.add('success');
        successStatus.textContent = '压缩成功';
        const previewLink = document.createElement('a');
        previewLink.classList.add('preview');
        previewLink.textContent = '[预览]';
        previewLink.href = 'javascript:void(0)';
        previewLink.addEventListener('click', (e) => {
            e.preventDefault();
            showImageComparison(index);
        });
        fileStatus2.appendChild(successStatus);
        fileStatus2.appendChild(previewLink);
        if (isCompressed) fileStatus2.classList.add('show');
        const fileSize = document.createElement('div');
        fileSize.classList.add('fileSize');
        fileSize.textContent = isCompressed 
            ? (compressedFiles[index].size / 1024).toFixed(2) + ' KB' 
            : (file.size / 1024).toFixed(2) + ' KB';
        const fileDelete = document.createElement('div');
        fileDelete.classList.add('fileDelete');
        const deleteIcon = document.createElement('img');
        deleteIcon.src = '../static/image/delete.svg';
        deleteIcon.alt = '删除';
        deleteIcon.addEventListener('click', () => {
            uploadedFiles.splice(index, 1);
            compressedFiles.splice(index, 1);
            updateFileViewer();
        });
        fileDelete.appendChild(deleteIcon);
        fileItem.appendChild(fileName);
        fileItem.appendChild(fileStatus1);
        fileItem.appendChild(fileStatus2);
        fileItem.appendChild(fileSize);
        fileItem.appendChild(fileDelete);
        viewerItemsContainer.appendChild(fileItem);
    });
}
function handleFiles(files) {
    const maxInputSize = 3 * 1024 * 1024;
    const maxFileCount = 10;
    const newValidFiles = [];
    let oversizedCount = 0;
    Array.from(files).forEach(file => {
        if (file.size > maxInputSize) {
            oversizedCount++;
        } else {
            newValidFiles.push(file);
        }
    });
    if (oversizedCount > 0) {
        alert(`有 ${oversizedCount} 个文件超过 3MB，请重新选择！`);
    }
    if (newValidFiles.length === 0) return;
    const availableSlots = maxFileCount - uploadedFiles.length;
    let filesToAdd = [];
    if (availableSlots <= 0) {
        alert(`最多只能上传 ${maxFileCount} 个文件！`);
        return;
    } else if (newValidFiles.length > availableSlots) {
        filesToAdd = newValidFiles.slice(0, availableSlots);
        alert(`最多只能上传 ${maxFileCount} 个文件，已超出部分未添加！`);
    } else {
        filesToAdd = newValidFiles;
    }
    const newFiles = Array.from(filesToAdd);
    uploadedFiles = [...uploadedFiles, ...newFiles];
    compressedFiles = [...compressedFiles, ...new Array(newFiles.length)];
    uploaderContainer.style.display = 'none';
    viewerContainer.style.display = 'flex';
    updateFileViewer();
    console.log('已上传的文件：', uploadedFiles);
}
function convertToSVG(file, options) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                ImageTracer.imageToSVG(
                    e.target.result,
                    function(svgStr) {
                        resolve(svgStr);
                    },
                    {
                        numberofcolors: options.numberofcolors || 16,
                        pathomit: options.pathomit || 8,
                        blurradius: options.blurradius || 0,
                        colorquantcycles: 3,
                        scale: 1
                    }
                );
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}
document.getElementById('startCompress').addEventListener('click', async function () {
    const viewerItems = document.querySelectorAll('.viewerItem');
    if (viewerItems.length === 0) {
        alert("请先上传图片");
        return;
    }
    const colorNumber = parseInt(document.getElementById('sizeInput1').value, 10);
    const pathOmit = parseInt(document.getElementById('sizeInput2').value, 10);
    const blurRadius = parseInt(document.getElementById('sizeInput3').value, 10);
    if (isNaN(colorNumber) || colorNumber < 2 || colorNumber > 32) {
        alert("请输入有效的颜色数量（2-32）");
        return;
    }
    if (isNaN(pathOmit) || pathOmit < 0 || pathOmit > 20) {
        alert("请输入有效的路径简化值（0-20）");
        return;
    }
    if (isNaN(blurRadius) || blurRadius < 0 || blurRadius > 20) {
        alert("请输入有效的模糊半径（0-20）");
        return;
    }
    for (let i = 0; i < viewerItems.length; i++) {
        const status1Elem = viewerItems[i].querySelector('.fileStatus1');
        const status2Elem = viewerItems[i].querySelector('.fileStatus2');
        if (status1Elem) {
            status1Elem.textContent = '待转换';
            status1Elem.classList.add('show');
        }
        if (status2Elem) {
            status2Elem.classList.remove('show');
        }
    }
    if (typeof ImageTracer === 'undefined') {
        alert("矢量转换库未加载，请稍后再试");
        return;
    }
    for (let i = 0; i < uploadedFiles.length; i++) {
        try {
            const status1Elem = viewerItems[i].querySelector('.fileStatus1');
            if (status1Elem) {
                status1Elem.textContent = '转换中...';
            }
            const svgString = await convertToSVG(uploadedFiles[i], {
                numberofcolors: colorNumber,
                pathomit: pathOmit,
                blurradius: blurRadius
            });
            const svgFile = new File([svgString], uploadedFiles[i].name.replace(/\.[^/.]+$/, '') + '.svg', {
                type: 'image/svg+xml'
            });
            compressedFiles[i] = svgFile;
            const status1ElemAfter = viewerItems[i].querySelector('.fileStatus1');
            const status2Elem = viewerItems[i].querySelector('.fileStatus2');
            const sizeElem = viewerItems[i].querySelector('.fileSize');
            if (status1ElemAfter) status1ElemAfter.classList.remove('show');
            if (status2Elem) status2Elem.classList.add('show');
            if (sizeElem) {
                sizeElem.textContent = (svgFile.size / 1024).toFixed(2) + ' KB';
            }
            const previewContainer = viewerItems[i].querySelector('.previewContainer');
            if (previewContainer) {
                previewContainer.innerHTML = svgString;
                const svgElement = previewContainer.querySelector('svg');
                if (svgElement) {
                    svgElement.style.maxWidth = '100%';
                    svgElement.style.maxHeight = '200px';
                }
            }
        } catch (error) {
            console.error("转换文件出错:", uploadedFiles[i].name, error);
            const status1Elem = viewerItems[i].querySelector('.fileStatus1');
            if (status1Elem) {
                status1Elem.textContent = '转换失败';
            }
        }
    }
    console.log("转换完成，转换后的文件：", compressedFiles);
});
document.getElementById('downloadAll').addEventListener('click', function () {
    if (compressedFiles.length === 0) {
        alert("没有压缩文件可供下载，请先进行压缩！");
        return;
    }
    compressedFiles.forEach(file => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    });
});
async function handleUploadClick() {
    if (compressedFiles.length === 0) {
      alert('请先压缩图片，再上传网盘');
      return;
    }
    const filesData = await Promise.all(compressedFiles.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          name: file.name,
          type: file.type,
          data: reader.result
        });
        reader.readAsDataURL(file);
      });
    }));
    window.parent.postMessage({
      type: 'UPLOAD_TO_DRIVE',
      files: filesData
    }, '*');
}
document.getElementById('googleDrive').addEventListener('click', handleUploadClick);
function showImageComparison(index) {
    console.log('Showing comparison for index:', index);
    console.log('Uploaded files:', uploadedFiles);
    console.log('Compressed files:', compressedFiles);
    if (index >= uploadedFiles.length || index >= compressedFiles.length) {
        console.error('Invalid index for comparison');
        return;
    }
    const originalFile = uploadedFiles[index];
    const compressedFile = compressedFiles[index];
    if (!originalFile || !compressedFile) {
        console.error('Missing file for comparison');
        return;
    }
    const originalReader = new FileReader();
    originalReader.onload = function(e) {
        originalImage.src = e.target.result;
        originalSize.textContent = `大小: ${(originalFile.size / 1024).toFixed(2)} KB`;
    };
    originalReader.readAsDataURL(originalFile);
    const compressedReader = new FileReader();
    compressedReader.onload = function(e) {
        compressedImage.src = e.target.result;
        compressedSize.textContent = `大小: ${(compressedFile.size / 1024).toFixed(2)} KB`;
    };
    compressedReader.readAsDataURL(compressedFile);
    modal.style.display = 'block';
}
closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
});
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});