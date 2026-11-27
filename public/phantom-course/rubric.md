# PHANTOM Security Findings Review | Student rubric

**Case PFR-QUEUE-01 · Edition 1.0 · Total 100 points**

| Criterion | Points | What earns full credit |
| --- | ---: | --- |
| Provenance | 10 | Provide the case ID, edition, file name, computed source SHA-256 and the comparison result. |
| First alert | 20 | Give an accurate verdict, trace the relevant statements in order and cite the controlling lines. |
| Second alert | 20 | Give an accurate verdict, explain each applicable condition and cite the controlling lines. |
| Priority and impact | 15 | Identify who can perform each action, explain the observable consequence, distinguish possible downstream effects and recommend a defensible priority. |
| Correction and verification | 25 | Recommend a minimal change and cover both sides of each policy boundary, expected stored state, authorization and the neighboring setting. Distinguish proposed checks from executed checks. |
| Coverage and communication | 10 | Name a missing artifact, explain which conclusion depends on it, give a focused follow-up and communicate a clear release decision. |

A passing report scores **at least 80/100** and satisfies all four essential checks.

1. Both alert verdicts match the evidence.
2. Both verdicts cite decisive lines or line ranges from the supplied source.
3. At least one proposed acceptance check would distinguish the required correction from the original behavior.
4. The release recommendation accurately states a material coverage limit and avoids claiming an observed downstream effect without evidence.

A high point total with a missed essential check qualifies for revision. Tuition includes one revision after written feedback. The credential attests to passing this edition's course assessment in source review, findings triage, reporting and remediation verification.
