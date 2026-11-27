# Reading the original X3 Sentinel report

Open the [original scanner output](sentinel-report.json) and find `files[0].sha256`. It matches the SHA-256 of the case's `sample-contract.sol`. Both the machine and the classroom reviewer examined the same bytes.

| What to check | What this run records |
| --- | --- |
| Tool and mode | X3 Sentinel 0.1.0, read-only static scan, report schema 1 |
| Input | One local source file, `sample-contract.sol`, outside a Git worktree |
| Rules applicable to this file | Three Solidity pattern rules (SOL001–SOL003) and three general secret-pattern rules (SEC001–SEC003) |
| Result | One candidate file, one scanned, zero skipped, zero findings |
| Identity of the source snapshot | `182233a830625118a257ad3f401cd90e1bbb67890921244841ee2bbcbcf13b43` |

**What does the empty findings list tell you?** None of the six applicable patterns matched. The Solidity rules in this version look for three specific code patterns. None compares a setter's permissions with the curator policy written on line 5. LAB-01 and LAB-02 in the classroom report are two leads written by the instructor to exercise that decision.

**How far does coverage extend?** In the scanner JSON, `coverage_complete` is true for the one-file input directory. In the classroom packet, the broader review also includes the schedule display, whose source was never supplied. Its effect on what attendees actually see remains open. The input was a standalone snapshot, which explains the empty Git revision field.

The run used Python 3.12.14 and X3 Sentinel source revision `dae1b0c2c9f132aaa1cc2983fa03b5df196d1871`. Only the local `scan` command was used. The SHA-256 of the original JSON bytes is `aba4f5ecf0bb279d20d3b26e8fb1169d230b905a855fbdd63ad6265ccc340971`. [Scanner rules at the pinned revision](https://github.com/Cyptopimpinainteazy/x3-sentinel/blob/dae1b0c2c9f132aaa1cc2983fa03b5df196d1871/sentinel/scanner.py)
