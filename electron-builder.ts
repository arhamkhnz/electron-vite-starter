import type { Configuration } from "electron-builder";

const config: Configuration = {
  appId: "com.electron.electron-vite-starter",
  directories: {
    output: "out",
  },
  files: ["dist/**", "package.json"],
  asar: true,
  asarUnpack: ["**/*.node"],
  allowMissingDependencies: false,
  publish: null,
  electronFuses: {
    runAsNode: false,
    enableCookieEncryption: true,
    enableNodeOptionsEnvironmentVariable: false,
    enableNodeCliInspectArguments: false,
    grantFileProtocolExtraPrivileges: false,
    enableEmbeddedAsarIntegrityValidation: true,
    onlyLoadAppFromAsar: true,
  },
  mac: {
    target: ["dmg", "zip"],
    artifactName: "${name}-${version}-macos-${arch}.${ext}",
    // Re-sign ad hoc because flipping Electron's fuses invalidates its original signature.
    identity: "-",
    hardenedRuntime: false,
    notarize: false,
  },
  win: {
    target: ["nsis"],
    artifactName: "${name}-${version}-windows-${arch}-setup.${ext}",
  },
  nsis: {
    oneClick: true,
    perMachine: false,
  },
  linux: {
    target: ["deb", "rpm"],
    category: "Utility",
  },
};

export default config;
