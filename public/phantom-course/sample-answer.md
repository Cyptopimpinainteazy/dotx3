# Worked case · Who can rename the workshop?

Two alerts point to functions that edit a classroom schedule. You are reviewing a fictional directory whose curator owns both labels. Allow about 15 minutes. You will need only the [source snapshot](sample-contract.sol) and [practice report](sample-report.json). An instructor wrote the two candidate alerts for this exercise.

**Try it first.** Read the owner policy on line 5. Follow each setter from its declaration to the line that changes the label. For each alert, write down who can reach the write, which lines prove it, and what you would tell the maintainer. Then name one question the supplied materials leave open.

## Worked answer

| Alert | Decision | Source evidence |
| --- | --- | --- |
| LAB-01 · morning label | Close the suspected missing-guard finding. | Line 22 applies `onlyCurator`. Lines 17–20 check the caller before the function body runs. The constructor sets the immutable curator on lines 7 and 13–15. The write on line 23 therefore requires the curator. |
| LAB-02 · evening label | Report a missing authorization check. | Line 26 declares an external setter without the curator modifier. Line 27 writes the evening label directly. That path conflicts with the policy on line 5. |

### What to send the maintainer

The morning label already enforces the curator policy. The evening setter is missing the same check, so a caller other than the curator can change that label in the contract. Within this classroom example, the affected property is the integrity of one piece of schedule metadata. The report provides no evidence about money, private data, or a deployed service.

Apply the existing `onlyCurator` modifier to `setEveningLabel`. For acceptance, require tests showing that the curator can update each label, that a different account is refused for each setter, and that a refused update preserves the previous value. These are proposed checks. This case contains no test run.

### What remains unknown

The schedule display is within the fictional project scope, but its source is missing from the packet. We cannot tell whether it reads the contract label, uses a cached copy, or gets its text elsewhere. A maintainer would need the display's data-loading code to determine whether attendees could see an incorrect title.

### Evidence receipt

Source file: `sample-contract.sol`
SHA-256: `182233a830625118a257ad3f401cd90e1bbb67890921244841ee2bbcbcf13b43`

The digest identifies the exact bytes used for these line references. The decisions above come from reading those bytes against the stated owner policy.
