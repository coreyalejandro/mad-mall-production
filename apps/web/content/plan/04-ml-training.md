# ML Training Component

Focus: a traceable training pipeline for MADMall's distributed data.

## Training loop

1. Ingest events (byte-size)
2. Validate schema + consent scope
3. Label (human + clinician + adjudication + audit)
4. Train baseline models
5. Monitor drift + fairness metrics
6. Iterate with receipts

## Initial model targets (non-medical-advice)

- Flare risk proxy classifier (research-only; not used for diagnosis)
- Outreach prioritization (who to check on)
- Education personalization (what content helps)

## Artifact contract

Every training run produces:

- Dataset manifest (hashes)
- Feature spec
- Metrics report
- Model artifact
- Receipt (run id, time, inputs)
