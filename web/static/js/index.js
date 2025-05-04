document.addEventListener("DOMContentLoaded", function () {
    const sidebarLinks = document.querySelectorAll(".sidebar a");
    const iframe = document.querySelector(".iframeContainer");
    sidebarLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            sidebarLinks.forEach(item => item.classList.remove("active"));
            this.classList.add("active");

            const newSrc = this.getAttribute("data-src");
            iframe.setAttribute("src", newSrc);
        });
    });
});
let tokenClient;
let accessToken = null;
let userInfo = null;
window.onload = () => {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: '493186144586-qqqgvqhig2lroe2rghv4vggs1f61kgnq.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/drive.file profile email',
        callback: async (tokenResponse) => {
            accessToken = tokenResponse.access_token;
            console.log("Access Token:", accessToken);
            await fetchUserProfile();
            document.getElementById("authorize-button").style.display = "none";
            document.getElementById("user-image").style.display = "block";
        }
    });
    document.getElementById("authorize-button").onclick = () => {
        tokenClient.requestAccessToken();
    };
};
async function fetchUserProfile() {
    const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const data = await res.json();
    userInfo = data;
    document.getElementById("user-image").src = data.picture;
}
function dataURLToBlob(dataURL) {
    const [header, base64] = dataURL.split(',');
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return new Blob([array], { type: mime });
}
async function createZipFromFiles(files) {
    const zip = new JSZip();
    files.forEach(file => {
        const blob = dataURLToBlob(file.data);
        zip.file(file.name, blob, { binary: true });
    });
    return await zip.generateAsync({ type: 'blob' });
}
async function uploadToGoogleDrive(file) {
    const metadata = {
        name: file.name,
        mimeType: file.type
    };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
        body: form
    });
    if (!res.ok) {
        alert("上传失败，请检查授权状态和网络连接。");
        return false; // 返回失败
    }
    const result = await res.json();
    console.log("上传成功，文件 ID:", result.id);
    return true; // 返回成功
}
window.addEventListener('message', async (event) => {
    const data = event.data;
    if (data.type === 'UPLOAD_TO_DRIVE') {
        const files = data.files;
        if (!files || files.length === 0) {
            alert('接收到的文件为空');
            return;
        }
        const zipBlob = await createZipFromFiles(files);
        const zipFile = new File([zipBlob], 'compressed_images.zip', { type: 'application/zip' });
        const success = await uploadToGoogleDrive(zipFile);
        if (success) {
            alert('上传成功！');
        } else {
            alert('上传失败，请检查授权状态和网络连接')
        }
    }
});