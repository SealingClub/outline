/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { exec } = require("child_process");
const { readdirSync, existsSync } = require("fs");

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execAsync(cmd) {
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

async function build() {
  // Clean previous build
  console.log("Clean previous build…");

  await Promise.all([
    execAsync("erase /S /Q .\\build\\server"),
    execAsync("erase /S /Q .\\build\\plugins"),
  ]);

  const d = getDirectories("./plugins");

  // Compile server and shared
  console.log("Compiling…");
  await Promise.all([
    execAsync(
      "yarn babel --extensions .ts,.tsx --quiet -d ./build/server ./server"
    ),
    execAsync(
      "yarn babel --extensions .ts,.tsx --quiet -d ./build/shared ./shared"
    ),
    ...d.map(async (plugin) => {
      const hasServer = existsSync(`.\\plugins\\${plugin}\\server`);

      if (hasServer) {
        await execAsync(
          `yarn babel --extensions .ts,.tsx --quiet -d "./build/plugins/${plugin}/server" "./plugins/${plugin}/server"`
        );
      }
    }),
  ]);

  // Copy static files
  console.log("Copying static files…");
  await Promise.all([
    execAsync(
      "copy .\\server\\collaboration\\Procfile .\\build\\server\\collaboration\\Procfile > NUL"
    ),
    execAsync(
      "copy .\\server\\static\\error.dev.html .\\build\\server\\error.dev.html > NUL"
    ),
    execAsync(
      "copy .\\server\\static\\error.prod.html .\\build\\server\\error.prod.html > NUL"
    ),
    execAsync("copy package.json .\\build > NUL"),
    ...d.map(async (plugin) =>
      execAsync(
        `copy .\\plugins\\${plugin}\\plugin.json .\\build\\plugins\\${plugin}\\plugin.json > NUL`
      )
    ),
  ]);

  console.log("Done!");
}

void build();
