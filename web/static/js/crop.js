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
const uploaderContainer = document.querySelector('.uploaderContainer');
const viewerContainer = document.querySelector('.viewerContainer');
const iframe = document.querySelector('.iframe');
let allowedTypes = '.png, .jpg, .jpeg, .webp';
cleanAllButton.addEventListener('click', () => {
    uploadedFiles = [];
    compressedFiles = [];
    uploaderContainer.style.display = 'flex';
    viewerContainer.style.display = 'none';
});
basicSettings.style.display = 'flex';
uploaderContainer.addEventListener('click', function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = false;
    fileInput.accept = allowedTypes;
    fileInput.click();
    fileInput.addEventListener('change', function(event) {
        const files = event.target.files;
        if (files.length > 1) {
            alert('只支持单张图片上传，已自动选择第一张图片');
        }
        handleFiles([files[0]]);
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
iframe.addEventListener('drop', function(event) {
    event.preventDefault();
    iframe.style.backgroundColor = '#fff';
    const files = event.dataTransfer.files;
    if (files.length > 1) {
        alert('只支持单张图片上传，已自动选择第一张图片');
    }
    const file = files[0];
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.split(', ').includes(`.${extension}`)) {
        alert('不支持的文件类型，请上传PNG、JPG、JPEG或WEBP格式的图片');
        return;
    }
    handleFiles([file]);
});
function handleFiles(files) {
    const maxInputSize = 3 * 1024 * 1024;
    uploadedFiles = [];
    const file = files[0];
    if (file.size > maxInputSize) {
        alert('文件超过3MB，请重新选择！');
        return;
    }
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.split(', ').includes(`.${extension}`)) {
        alert('不支持的文件类型，请上传PNG、JPG、JPEG或WEBP格式的图片');
        return;
    }
    uploadedFiles.push(file);
    compressedFiles = [];
    const reader = new FileReader();
    reader.onload = function(e) {
        const uploadedImage = document.getElementById('uploaded-image');
        uploadedImage.src = e.target.result;
        initCropArea();
    };
    reader.readAsDataURL(file);
    uploaderContainer.style.display = 'none';
    viewerContainer.style.display = 'flex';
}
function initCropInteraction() {
    const cropArea = document.getElementById('crop-area');
    const resizeHandles = document.querySelectorAll('.resize-handle');
    let isDragging = false;
    cropArea.addEventListener('mousedown', function(event) {
        if (event.target !== cropArea) return;
        isDragging = true;
        const offsetX = event.clientX - cropArea.offsetLeft;
        const offsetY = event.clientY - cropArea.offsetTop;
        function dragMove(e) {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                cropArea.style.left = `${x}px`;
                cropArea.style.top = `${y}px`;
            }
        }
        function dragEnd() {
            isDragging = false;
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('mouseup', dragEnd);
        }
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
    });
    let isResizing = false;
    let currentHandle = null;
    resizeHandles.forEach(handle => {
        handle.addEventListener('mousedown', function(event) {
            isResizing = true;
            currentHandle = handle;
            event.preventDefault();
            const startX = event.clientX;
            const startY = event.clientY;
            const startWidth = cropArea.offsetWidth;
            const startHeight = cropArea.offsetHeight;
            const startLeft = cropArea.offsetLeft;
            const startTop = cropArea.offsetTop;
            function resizeMove(e) {
                if (isResizing) {
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    let newWidth = startWidth;
                    let newHeight = startHeight;
                    let newLeft = startLeft;
                    let newTop = startTop;
                    if (currentHandle.classList.contains('tl')) {
                        newWidth = Math.max(startWidth - deltaX, 50);
                        newHeight = Math.max(startHeight - deltaY, 50);
                        newLeft = startLeft + deltaX;
                        newTop = startTop + deltaY;
                    } else if (currentHandle.classList.contains('tr')) {
                        newWidth = Math.max(startWidth + deltaX, 50);
                        newHeight = Math.max(startHeight - deltaY, 50);
                        newTop = startTop + deltaY;
                    } else if (currentHandle.classList.contains('bl')) {
                        newWidth = Math.max(startWidth - deltaX, 50);
                        newHeight = Math.max(startHeight + deltaY, 50);
                        newLeft = startLeft + deltaX;
                    } else if (currentHandle.classList.contains('br')) {
                        newWidth = Math.max(startWidth + deltaX, 50);
                        newHeight = Math.max(startHeight + deltaY, 50);
                    }
                    cropArea.style.width = `${newWidth}px`;
                    cropArea.style.height = `${newHeight}px`;
                    cropArea.style.left = `${newLeft}px`;
                    cropArea.style.top = `${newTop}px`;
                }
            }
            function resizeEnd() {
                isResizing = false;
                document.removeEventListener('mousemove', resizeMove);
                document.removeEventListener('mouseup', resizeEnd);
            }
            document.addEventListener('mousemove', resizeMove);
            document.addEventListener('mouseup', resizeEnd);
        });
    });
}
function initCropArea() {
    const uploadedImage = document.getElementById('uploaded-image');
    const cropArea = document.getElementById('crop-area');
    uploadedImage.onload = function() {
        initCropInteraction();
    };
    if (uploadedImage.complete) {
        uploadedImage.onload();
    }
}
document.getElementById('startCompress').addEventListener('click', function() {
    const uploadedImage = document.getElementById('uploaded-image');
    const cropArea = document.getElementById('crop-area');
    if (!uploadedImage.src || uploadedImage.src === '../static/image/test.jpeg') {
        alert("请先上传图片");
        return;
    }
    const cropRect = cropArea.getBoundingClientRect();
    const imageRect = uploadedImage.getBoundingClientRect();
    const scaleX = uploadedImage.naturalWidth / imageRect.width;
    const scaleY = uploadedImage.naturalHeight / imageRect.height;
    const cropWidth = cropRect.width * scaleX;
    const cropHeight = cropRect.height * scaleY;
    const cropX = (cropRect.left - imageRect.left) * scaleX;
    const cropY = (cropRect.top - imageRect.top) * scaleY;
    const canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(uploadedImage, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    canvas.toBlob(function(blob) {
        const originalFile = uploadedFiles[0];
        const newName = originalFile.name.replace(/(\.\w+)$/, '_cropped.png');
        const croppedFile = new File([blob], newName, { type: 'image/png' });
        compressedFiles = [croppedFile];
        alert('图片已裁剪为PNG格式！');
    }, 'image/png');
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
