#!/usr/bin/env node

import { spawn } from "node:child_process";
import os from "node:os";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function isPrivateIPv4(address) {
  return (
    address.startsWith("10.") ||
    address.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(address)
  );
}

function pickHost() {
  if (process.env.ORBIT_LAN_HOST) {
    return process.env.ORBIT_LAN_HOST;
  }

  const interfaces = os.networkInterfaces();
  const addresses = Object.values(interfaces).flatMap((entries) => entries ?? []);

  const privateAddress = addresses.find(
    (entry) =>
      entry &&
      entry.family === "IPv4" &&
      !entry.internal &&
      isPrivateIPv4(entry.address),
  );

  if (privateAddress) {
    return privateAddress.address;
  }

  const anyExternalAddress = addresses.find(
    (entry) => entry && entry.family === "IPv4" && !entry.internal,
  );

  return anyExternalAddress?.address ?? "localhost";
}

function parseArgs(argv) {
  const passthrough = [];
  let host = pickHost();
  let port = process.env.PORT ?? "3000";

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--host" || arg === "-H") {
      host = argv[index + 1] ?? host;
      index += 1;
      continue;
    }

    if (arg.startsWith("--host=")) {
      host = arg.slice("--host=".length);
      continue;
    }

    if (arg === "--port" || arg === "-p") {
      port = argv[index + 1] ?? port;
      index += 1;
      continue;
    }

    if (arg.startsWith("--port=")) {
      port = arg.slice("--port=".length);
      continue;
    }

    passthrough.push(arg);
  }

  return { host, port, passthrough };
}

const { host, port, passthrough } = parseArgs(process.argv);
const nextBin = require.resolve("next/dist/bin/next");

console.log(
  `Starting HTTPS dev server for WebXR at https://${host}:${port} ...`,
);

const child = spawn(
  process.execPath,
  [
    nextBin,
    "dev",
    "--experimental-https",
    "--hostname",
    host,
    "--port",
    port,
    ...passthrough,
  ],
  {
    env: process.env,
    stdio: "inherit",
  },
);

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    child.kill(signal);
  });
}

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
