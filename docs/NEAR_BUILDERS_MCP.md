# NEAR Builders MCP

The project-local Codex configuration in `.codex/config.toml` connects the Streamable HTTP endpoint `https://nearbuilders.org/api/mcp`.

Every request supplies `x-api-key` from the runtime environment variable `NEAR_BUILDERS_API_KEY`. No API key belongs in this repository, an `.env` file, or the configuration file. The explicit `User-Agent` matches the client used for the verified connection.

## Start a session without saving the key

Run the project launcher from an interactive terminal:

```bash
python3 scripts/codex-near-builders.py
```

It reads the MCP settings from `.codex/config.toml`, prompts for the key without echoing or saving it, and passes the key only through the child process environment. If `NEAR_BUILDERS_API_KEY` is already present, it uses that value without prompting. It supplies the project settings as explicit Codex overrides, including for CLI subcommands that did not discover the project configuration in this environment.

To inspect the registered connection with the same launcher:

```bash
python3 scripts/codex-near-builders.py mcp get near_builders --json
```

For the desktop app, provide the variable through its launching environment and reload the project/session so the project-local MCP configuration is loaded. Project configuration must be trusted. Do not paste the key into a tracked config or a frontend environment variable.

## Profile and authorization

The intended builder account is `dotx3.near`. `submitBuilderProfile` takes `name`, `bio` and `skills`, plus optional links/catalog fields. Its discovered schema has no `nearAccount` parameter: the service determines the submitter from authentication. Inspect the returned account and proposal status before treating a request as a successful submission for the intended account.

A directory proposal is not necessarily an approved public profile. Do not auto-approve, nominate others, change collaborators or perform registry writes merely because the server exposes those tools.

Configuration reference: https://developers.openai.com/codex/config-reference/
