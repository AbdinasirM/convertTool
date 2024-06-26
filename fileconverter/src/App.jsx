import React, { useState, useRef } from 'react';
import ConvertApi from 'convertapi-js';



function App() {
  const [file, setFile] = useState(null);
  const [convertFrom, setConvertFrom] = useState('DWG');
  const [convertTo, setConvertTo] = useState('PDF');
  const [convertedFile, setConvertedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [conversionError, setConversionError] = useState('');
  const fileInputRef = useRef(null); // Create a ref for file input

 // Read API key from environment variable
  // Read API key from environment variable using Vite.js
  const convertApiSecret = import.meta.env.CONVERT_API_SECRET;
  let convertApi = ConvertApi.auth(convertApiSecret);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setConvertedFile(null); // Reset converted file state
    setConversionError('');

    // Reset file input to allow selecting the same file again
    event.target.value = null; // This line should work fine in most cases
    // Alternatively, you can use the ref approach to reset input value
    // if (fileInputRef.current) {
    //   fileInputRef.current.value = null;
    // }
  };

  const handleConvert = async () => {
    if (!file) {
      alert('Please choose a file to convert.');
      return;
    }

    setLoading(true);

    let params = convertApi.createParams();
    params.add('file', file);

    try {
      let result = await convertApi.convert(convertFrom.toLowerCase(), convertTo.toLowerCase(), params);
      let url = result.files[0].Url;
      setConvertedFile(url);
    } catch (error) {
      console.error('Conversion error:', error);
      setConversionError('An error occurred during conversion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadConvertedFile = () => {
    if (convertedFile) {
      const link = document.createElement('a');
      link.href = convertedFile;
      link.setAttribute('download', true);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clear inputs after successful conversion and download
      setFile(null);
      setConvertedFile(null);
      setConvertFrom('DWG');
      setConvertTo('PDF');
    } else {
      alert('No file has been converted yet.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <a
        href="https://www.linkedin.com/in/abdinasir-mumin"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-50 text-md mb-4 self-center"
      >
        Made by: Abdi
      </a>

      <div className="max-w-4xl w-full px-6 py-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
        <form className="mb-6">
          <label htmlFor="file_input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Upload a file to convert</label>
          <div className="relative">
            <input id="file_input" type="file" className="hidden" onChange={handleFileChange} ref={fileInputRef} /> {/* Bind the ref to the input */}
            <label htmlFor="file_input" className="w-full flex items-center justify-center px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-gray-100 dark:border-transparent dark:focus:bg-blue-700 dark:placeholder-gray-400 focus:outline-none">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Choose File
            </label>
            <span id="file_name" className="absolute bottom-0 left-0 right-0 px-4 py-2 text-sm text-gray-500">{file ? file.name : ''}</span>
          </div>
        </form>

        <div className="grid md:flex md:flex-row md:gap-6 mb-6">
          <div className="flex-1 mb-4 md:mb-0">
            <label htmlFor="convert_from" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Convert From</label>
            <select id="convert_from" value={convertFrom} onChange={(e) => setConvertFrom(e.target.value)} className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="DWG">DWG</option>
              <option value="PDF">PDF</option>
              <option value="PNG">PNG</option>
              <option value="XLS">XLS</option>
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="convert_to" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Convert To</label>
            <select id="convert_to" value={convertTo} onChange={(e) => setConvertTo(e.target.value)} className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="DWG">DWG</option>
              <option value="PDF">PDF</option>
              <option value="PNG">PNG</option>
              <option value="XLS">XLS</option>
            </select>
          </div>
        </div>

        <button type="button" onClick={handleConvert} className={`w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {loading ? 'Converting...' : 'Convert File'}
        </button>

        {conversionError && (
          <div className="mt-4 text-sm text-red-600 dark:text-red-400">{conversionError}</div>
        )}

        {convertedFile && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{`${file.name} has been converted. `}<button onClick={downloadConvertedFile} className="text-blue-500 hover:underline">Download it here.</button></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
