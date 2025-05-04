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
const maxSize = document.getElementById('maxSize');
const sizeInput = document.getElementById('sizeInput');
function updateSliderBackground1() {
    const value = maxSize.value;
    const min = parseFloat(maxSize.min);
    const max = parseFloat(maxSize.max);
    const progress = ((value - min) / (max - min)) * 100;
    maxSize.style.background = `linear-gradient(to right, #165dff ${progress}%, #ccc ${progress}%)`;
}
maxSize.addEventListener('input', function () {
    sizeInput.value = this.value;
    updateSliderBackground1();
});
sizeInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const min = parseFloat(maxSize.min);
        const max = parseFloat(maxSize.max);
        let value = parseFloat(this.value);
        if (isNaN(value)) {
            value = min;
        } else if (value < min) {
            value = min;
        } else if (value > max) {
            value = max;
        }
        this.value = value;
        maxSize.value = value;
        updateSliderBackground1();
    }
});
updateSliderBackground1();
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
document.getElementById('startCompress').addEventListener('click', async function () {
    const viewerItems = document.querySelectorAll('.viewerItem');
    if (viewerItems.length === 0) {
        alert("请先上传图片");
        return;
    }
    let options = { useWebWorker: true, quality: 1 };
    const maxSizeCheckbox = document.querySelector('input[value="maxSize"]');
    const maxWidthOrHeightCheckbox = document.querySelector('input[value="maxWidthOrHeight"]');
    const outputFormat = document.getElementById('outputFormat').value;
    if (!maxSizeCheckbox.checked && !maxWidthOrHeightCheckbox.checked) {
        alert("请至少选择一个压缩模式");
        return;
    }
    if (maxSizeCheckbox.checked) {
        let targetSizeKB = parseInt(document.getElementById('sizeInput').value, 10);
        if (isNaN(targetSizeKB) || targetSizeKB <= 0) {
            alert("请输入有效的目标大小（KB）");
            return;
        }
        options.maxSizeMB = targetSizeKB / 1024;
    }
    if (maxWidthOrHeightCheckbox.checked) {
        const maxWidthOrHeightValue = parseInt(document.getElementById('maxWidthorHeight').value, 10);
        if (isNaN(maxWidthOrHeightValue) || maxWidthOrHeightValue < 200) {
            alert("请输入大于等于200的最大长宽值（px）");
            return;
        }
        options.maxWidthOrHeight = maxWidthOrHeightValue;
    }
    options.fileType = outputFormat;
    for (let i = 0; i < uploadedFiles.length; i++) {
        try {
            const status1Elem = viewerItems[i].querySelector('.fileStatus1');
            if (status1Elem) {
                status1Elem.textContent = '压缩中...';
            }
            let compressedFile = await imageCompression(uploadedFiles[i], options);
            let newFileName = uploadedFiles[i].name.replace(/\.[^.]+$/, '');
            let extension = outputFormat.split('/')[1];
            compressedFile = new File([compressedFile], `${newFileName}.${extension}`, { type: outputFormat });
            if (!compressedFiles[i]) {
                compressedFiles[i] = compressedFile;
            } else {
                compressedFiles[i] = compressedFile;
            }
            const status1ElemAfter = viewerItems[i].querySelector('.fileStatus1');
            const status2Elem = viewerItems[i].querySelector('.fileStatus2');
            const sizeElem = viewerItems[i].querySelector('.fileSize');
            if (status1ElemAfter) status1ElemAfter.classList.remove('show');
            if (status2Elem) status2Elem.classList.add('show');
            if (sizeElem) {
                sizeElem.textContent = (compressedFile.size / 1024).toFixed(2) + ' KB';
            }
        } catch (error) {
            console.error("压缩文件出错:", uploadedFiles[i].name, error);
            const status1Elem = viewerItems[i].querySelector('.fileStatus1');
            if (status1Elem) {
                status1Elem.textContent = '压缩失败';
            }
        }
    }
    console.log("压缩完成，压缩后的文件：", compressedFiles);
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
const selectBtn = document.getElementById('outputFormatBtn');
const selectDropup = document.getElementById('outputFormatDropdown');
const options = document.querySelectorAll('#outputFormatDropdown .select-option');
const hiddenSelect = document.getElementById('outputFormat');
function initSelect() {
    const selectedOption = hiddenSelect.options[hiddenSelect.selectedIndex];
    selectBtn.textContent = selectedOption.textContent;
}
selectBtn.addEventListener('click', () => {
    selectBtn.classList.toggle('open');
    selectDropup.classList.toggle('open');
});
options.forEach(option => {
    option.addEventListener('click', () => {
        selectBtn.textContent = option.textContent;
        selectBtn.classList.remove('open');
        selectDropup.classList.remove('open');
        const value = option.getAttribute('data-value');
        hiddenSelect.value = value;
        console.log('选择了:', value);
    });
});
document.addEventListener('click', (e) => {
    if (!e.target.closest('.slider-container')) {
        selectBtn.classList.remove('open');
        selectDropup.classList.remove('open');
    }
});
initSelect();
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