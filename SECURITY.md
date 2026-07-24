# Reporting a Vulnerability

To report a vulnerability, please open a private vulnerability report at https://github.com/taugr/vuemarkik/security.

While the discovery of new vulnerabilities is rare, we recommend always using the latest versions of VueMarkik to ensure your application remains as secure as possible.

## Supported Versions

Security fixes are provided for the latest published major version.

## Rendering Security

VueMarkik renders markdown as Vue VNodes without `v-html`, leaves raw HTML
disabled, and applies a default URL policy after remark and rehype plugins run.
The policy removes URL properties with protocols such as `javascript:`,
`vbscript:`, and `data:`.

VueMarkik 1.x does not fully sanitize arbitrary HAST produced by plugins.
Plugins, custom components, slots, and custom URL transforms are trusted
application code. See the
[security guide](https://vuemarkik.dev/guide/security) for the current threat
model and guidance.
