# Reporting a Vulnerability

To report a vulnerability, please open a private vulnerability report at https://github.com/taugr/vuemarkik/security.

While the discovery of new vulnerabilities is rare, we recommend always using the latest versions of VueMarkik to ensure your application remains as secure as possible.

## Supported Versions

Security fixes are provided for the latest published major version.

## Rendering Security

VueMarkik renders markdown as Vue VNodes without `v-html`, leaves raw HTML
In safe mode it also sanitizes the final HAST after plugins run, removing
elements and properties that are not allowed by the default schema. The URL
policy removes properties with protocols such as `javascript:`, `vbscript:`,
and `data:`.

Trusted mode intentionally skips final-HAST sanitization for compatibility.
Plugins, custom components, slots, custom schemas, and custom URL transforms
are trusted application code. See the
[security guide](https://vuemarkik.dev/guide/security) for the current threat
model and guidance.
