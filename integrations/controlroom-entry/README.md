# Control Room entry point

`command.dotx3.net` is an entry point to the existing authenticated Control Room at `https://controlroom.x3star.net`. This small Vercel project redirects all paths there with HTTP 307. It hosts no worker, signs no transaction, proxies no credentials and changes no Control Room access policy. The final browser address is the existing Control Room host.

The public docs/NEAR website is the separate `dotx3` project at `dotx3.net`. Do not attach `command.dotx3.net` to that website project.

Deploy this directory to Vercel project `dotx3-command`. It is a static site with no install/build step and output directory `public`. `vercel.json` defines the redirect. DNS ownership and routing must be verified before the custom hostname works. Verify the redirect status and Location for a path/query, then verify the destination still requires its normal authentication.
