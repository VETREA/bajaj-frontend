import { useState } from "react";

export default function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(["Alphabets", "Numbers", "Highest Alphabet"]); // Default selected

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error("Invalid JSON structure");
      }
      const res = await fetch("https://bajaj-backend-f227.onrender.com/bfhl", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedData),
      });
      const result = await res.json();
      console.log("Response from backend:", result);  // Debugging line
      setResponse(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  // Ensure response exists before filtering
  const filteredResponse = response
    ? {
        numbers: selectedFilters.includes("Numbers") ? response.numbers : [],
        alphabets: selectedFilters.includes("Alphabets") ? response.alphabets : [],
        highest_alphabet: selectedFilters.includes("Highest Alphabet") ? response.highest_alphabet : [],
      }
    : null;

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Your Roll Number</h1>
      
      <textarea
        className="border p-2 w-96 h-20"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON like { "data": ["A", "1"] }'
      ></textarea>

      <button className="bg-blue-500 text-white p-2 mt-2" onClick={handleSubmit}>
        Submit
      </button>

      {error && <p className="text-red-500 mt-2">Error: {error}</p>}

      {response && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Filter Response:</h2>

          <select
            multiple
            className="border p-2"
            value={selectedFilters} // Ensures options remain selected
            onChange={(e) => setSelectedFilters([...e.target.selectedOptions].map(o => o.value))}
          >
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest Alphabet">Highest Alphabet</option>
          </select>

          <pre className="bg-gray-100 p-2 mt-2">
            {JSON.stringify(filteredResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
