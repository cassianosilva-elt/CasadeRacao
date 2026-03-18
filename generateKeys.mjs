import fs from "fs";

const content = fs.readFileSync("keys.env", "utf8");
const lines = content.split("\n");
let ps1 = "";
for (const line of lines) {
  if (!line || !line.includes("=")) continue;
  const idx = line.indexOf("=");
  const key = line.slice(0, idx);
  let val = line.slice(idx + 1);
  if (val.startsWith('"') && val.endsWith('"')) {
    val = val.slice(1, -1);
  }
  ps1 += `npx.cmd convex env set ${key} -- '${val}'\n`;
}
fs.writeFileSync("set_env.ps1", ps1);
console.log("Executing PowerShell to set variables...");
try {
  const { execSync } = await import("child_process");
  execSync("powershell.exe -ExecutionPolicy Bypass -File .\\set_env.ps1", { stdio: "inherit" });
  console.log("Successfully set variables.");
} catch(err) {
  console.error("Failed to execute PowerShell script:", err.message);
}
