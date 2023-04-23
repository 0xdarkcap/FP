// Function to convert JSON data to binary


export function jsonToBinary(jsonData) {
    const jsonString = JSON.stringify(jsonData);
    const buffer = new TextEncoder().encode(jsonString);
    const binaryData = Array.from(buffer, byte => byte.toString(2).padStart(8, '0')).join('');
    return binaryData;
  }
  
  // Function to convert binary data back to JSON
  export function binaryToJson(binaryData) {
    const byteChunks = binaryData.match(/.{1,8}/g);
    const buffer = new Uint8Array(byteChunks.map(byte => parseInt(byte, 2)));
    const jsonString = new TextDecoder().decode(buffer);
    const jsonData = JSON.parse(jsonString);
    return jsonData;
  }
  

  