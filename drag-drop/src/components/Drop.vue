<template>
    <div class="file-drop" @dragover.prevent @drop="handleDrop">
      <div v-if="!uploading">
        <p>Drag & Drop files here</p>
        <input type="file" ref="fileInput" style="display: none" @change="handleInputChange" multiple />
        <button @click="openFilePicker">or click to select files</button>
      </div>
      <div v-else>
        <p>Uploading...</p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
        <p>{{ progress }}%</p>
      </div>
    </div>
    <div class="uploaded-files">
      <p v-for="(fileName, index) in uploadedFileNames" :key="index">{{ `${index + 1}. ${fileName}` }}</p>
    </div>
  </template>
  
  <script setup>
import { ref } from 'vue';
import axios from 'axios';
import { defineExpose } from 'vue';

const uploading = ref(false);
const progress = ref(0);
const fileInput = ref(null);
const uploadedFileNames = ref([]);

const handleDrop = (event) => {
  event.preventDefault();
  uploadFiles(event.dataTransfer.files);
};

const handleInputChange = (event) => {
  uploadFiles(event.target.files);
};

const openFilePicker = () => {
  fileInput.value.click();
};


const uploadFiles = async (files) => {
  uploading.value = true;
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append('files[]', files[i]);
  }

  try {
    const response = await axios.post('http://localhost:3000/upload', formData, {
      onUploadProgress: (progressEvent) => {
        progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      },
    });
    // Handle successful upload response here
    console.log('Upload successful:', response.data);

    // Save uploaded file names to local storage
    saveFileNamesToLocalStorage(files);
  } catch (error) {
    // Handle upload error
    console.error('Error uploading files:', error);
  } finally {
    uploading.value = false;
    progress.value = 0;
  }
};

const saveFileNamesToLocalStorage = (files) => {
  const fileNames = Array.from(files).map((file) => file.name);
  const existingFileNames = localStorage.getItem('uploadedFileNames');

  if (existingFileNames) {
    const parsedFileNames = JSON.parse(existingFileNames);
    const updatedFileNames = [...parsedFileNames, ...fileNames];
    localStorage.setItem('uploadedFileNames', JSON.stringify(updatedFileNames));
    uploadedFileNames.value = updatedFileNames;
  } else {
    localStorage.setItem('uploadedFileNames', JSON.stringify(fileNames));
    uploadedFileNames.value = fileNames;
  }
};

defineExpose({
  uploading,
  progress,
  handleDrop,
  handleInputChange,
  openFilePicker,
  fileInput,
  uploadedFileNames,
});
  </script>
  
  <style>
 .file-drop {
  border: 2px dashed #ccc;
  padding: 20px;
  text-align: center;
  cursor: pointer;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #eee;
  border-radius: 4px;
  margin-top: 10px;
}

.progress {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
}

.uploaded-files {
    margin: auto;

    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: absolute;
    padding-left: 335px;
}
  </style>
  