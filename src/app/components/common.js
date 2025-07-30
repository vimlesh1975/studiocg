export const saveFile = async (options, data, fileHandle = null) => {
    if (window.showSaveFilePicker) {
        try {
            const handle = fileHandle || (await window.showSaveFilePicker(options));
            const writable = await handle.createWritable();
            await writable.write(data);
            await writable.close();
            console.log("File saved successfully!", handle.name);
            return handle; // Return the FileHandle object
        } catch (error) {
            console.error("Error saving the file:", error);
        }
    } else {
        const element = document.createElement("a");
        element.href = URL.createObjectURL(data);

        var retVal = prompt(
            "Enter  file name to save : ",
            generalFileName() + "_FileName"
        );
        if (retVal !== null) {
            element.download = retVal + (options.fileExtension ?? ".txt");
            document.body.appendChild(element); // Required for this to work in FireFox
            element.click();
        }
    }
};

export const generalFileName = () => {
    return new Date().toLocaleTimeString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour12: false,
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
    });
};

export const generateUniqueId = (object) => {
    return object.type + "_" + Number(Math.floor(Math.random() * 900) + 100); // Generates a number between 100 and 999
};
