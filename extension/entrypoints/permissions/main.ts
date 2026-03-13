// This page is loaded in an iframe injected by the content script.
// It requests mic permission on behalf of the extension. Once granted,
// all extension contexts (offscreen, side panel) inherit the grant.

async function requestMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    // Notify the parent (content script) that permission was granted
    window.parent.postMessage({ type: "PEERPULL_MIC_GRANTED" }, "*");
  } catch {
    window.parent.postMessage({ type: "PEERPULL_MIC_DENIED" }, "*");
  }
}

// Auto-request when loaded in iframe context
requestMic();
