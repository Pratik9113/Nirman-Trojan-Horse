const cron = require("node-cron");
const { exec } = require("child_process");

cron.schedule("0 0 1 * *", () => {
    console.log("Running Python script...");
    exec("python3 /path/to/your_script.py", (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Stderr: ${stderr}`);
            return;
        }
        console.log(`✅ Success: ${stdout}`);
    });
});

console.log("🚀 Reward script scheduled!");
