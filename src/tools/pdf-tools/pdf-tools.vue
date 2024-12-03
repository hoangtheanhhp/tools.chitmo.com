<script setup lang="ts">
// const router = useRouter();

// Function to handle redirect
function redirectToPDFTools() {
  window.location.href = 'https://pdf.chitmo.com';
};
</script>

<template>
  <c-card style="max-width: 600px;">
    <h2>PDF Tools</h2>
    <p>This tool will redirect you to a site for managing PDF files.</p>

    <n-divider />

    <div style="text-align: center;">
      <n-button type="primary" @click="redirectToPDFTools">
        Go to PDF Tools
      </n-button>
    </div>
  </c-card>
</template>
