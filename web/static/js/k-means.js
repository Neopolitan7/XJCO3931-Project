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

// 简化的K-means算法实现
function kmeans(points, k, maxIterations = 5) {
    // 1. 随机初始化聚类中心
    let centroids = [];
    for (let i = 0; i < k; i++) {
        const randomIndex = Math.floor(Math.random() * points.length);
        centroids.push([...points[randomIndex]]);
    }
    let labels = new Array(points.length);
    let changed;
    // 2. 迭代优化
    for (let iter = 0; iter < maxIterations; iter++) {
        changed = false;
        // 分配每个点到最近的聚类中心
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            let minDist = Infinity;
            let bestCluster = -1;
            for (let j = 0; j < centroids.length; j++) {
                const centroid = centroids[j];
                // 计算欧几里得距离的平方
                const dist = 
                    Math.pow(point[0] - centroid[0], 2) +
                    Math.pow(point[1] - centroid[1], 2) +
                    Math.pow(point[2] - centroid[2], 2);
                if (dist < minDist) {
                    minDist = dist;
                    bestCluster = j;
                }
            }
            if (labels[i] !== bestCluster) {
                labels[i] = bestCluster;
                changed = true;
            }
        }
        if (!changed) break;
        const clusterSums = new Array(k).fill().map(() => [0, 0, 0, 0]);
        for (let i = 0; i < points.length; i++) {
            const cluster = labels[i];
            clusterSums[cluster][0] += points[i][0];
            clusterSums[cluster][1] += points[i][1];
            clusterSums[cluster][2] += points[i][2];
            clusterSums[cluster][3] += 1; // 计数
        }
        for (let j = 0; j < k; j++) {
            const count = clusterSums[j][3];
            if (count > 0) {
                centroids[j][0] = Math.round(clusterSums[j][0] / count);
                centroids[j][1] = Math.round(clusterSums[j][1] / count);
                centroids[j][2] = Math.round(clusterSums[j][2] / count);
            }
        }
    }
    return { centroids, labels };
}
function kmeans(points, k, maxIterations = 5) {
    let centroids = [];
    for (let i = 0; i < k; i++) {
        const randomIndex = Math.floor(Math.random() * points.length);
        centroids.push([...points[randomIndex]]);
    }
    let labels = new Array(points.length);
    let changed;
    for (let iter = 0; iter < maxIterations; iter++) {
        changed = false;
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            let minDist = Infinity;
            let bestCluster = -1;
            for (let j = 0; j < centroids.length; j++) {
                const centroid = centroids[j];
                const dist = Math.pow(point[0] - centroid[0], 2) + Math.pow(point[1] - centroid[1], 2) + Math.pow(point[2] - centroid[2], 2);
                if (dist < minDist) {
                    minDist = dist;
                    bestCluster = j;
                }
            }
            if (labels[i] !== bestCluster) {
                labels[i] = bestCluster;
                changed = true;
            }
        }
        if (!changed) break;
        const clusterSums = new Array(k).fill().map(() => [0, 0, 0, 0]);
        for (let i = 0; i < points.length; i++) {
            const cluster = labels[i];
            clusterSums[cluster][0] += points[i][0];
            clusterSums[cluster][1] += points[i][1];
            clusterSums[cluster][2] += points[i][2];
            clusterSums[cluster][3] += 1;
        }
        for (let j = 0; j < k; j++) {
            const count = clusterSums[j][3];
            if (count > 0) {
                centroids[j][0] = Math.round(clusterSums[j][0] / count);
                centroids[j][1] = Math.round(clusterSums[j][1] / count);
                centroids[j][2] = Math.round(clusterSums[j][2] / count);
            }
        }
    }
    return { centroids, labels };
}
async function kMeansCompress(file, k) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (event) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                const points = [];
                for (let i = 0; i < pixels.length; i += 4) {
                    points.push([pixels[i], pixels[i + 1], pixels[i + 2]]);
                }
                const { centroids, labels } = kmeans(points, k);
                for (let i = 0; i < pixels.length; i += 4) {
                    const clusterIdx = labels[Math.floor(i / 4)];
                    const centroid = centroids[clusterIdx];
                    pixels[i] = centroid[0];
                    pixels[i + 1] = centroid[1];
                    pixels[i + 2] = centroid[2];
                }
                ctx.putImageData(imageData, 0, 0);
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Canvas to Blob conversion failed'));
                        return;
                    }
                    resolve(new File([blob], file.name, { type: file.type }));
                }, file.type || 'image/jpeg', 0.9);
            };
            img.onerror = () => reject(new Error('图片加载失败'));
            img.src = event.target.result;
        };
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsDataURL(file);
    });
}
document.getElementById('startCompress').addEventListener('click', async function () {
    const viewerItems = document.querySelectorAll('.viewerItem');
    if (viewerItems.length === 0) {
        alert("请先上传图片");
        return;
    }
    const kValue = parseInt(document.getElementById('sizeInput').value, 10);
    if (isNaN(kValue) || kValue < 2 || kValue > 64) {
        alert("请输入有效的K值（2-64）");
        return;
    }
    for (let i = 0; i < viewerItems.length; i++) {
        const status1Elem = viewerItems[i].querySelector('.fileStatus1');
        const status2Elem = viewerItems[i].querySelector('.fileStatus2');
        if (status1Elem) {
            status1Elem.textContent = '待压缩';
            status1Elem.classList.add('show');
        }
        if (status2Elem) {
            status2Elem.classList.remove('show');
        }
    }
    for (let i = 0; i < uploadedFiles.length; i++) {
        try {
            const status1Elem = viewerItems[i].querySelector('.fileStatus1');
            if (status1Elem) {
                status1Elem.textContent = '压缩中...';
            }
            const compressedFile = await kMeansCompress(uploadedFiles[i], kValue);
            compressedFiles[i] = compressedFile;
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