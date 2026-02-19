# Livepeer Canonical Mental Model (OSI‑Like Abstraction)

> **Purpose**
> Provide a single, canonical way to reason about Livepeer that cleanly bridges **protocol**, **network**, and **products**—similar to how the OSI model helps engineers reason about the Internet. This model is *conceptual*, not implementation‑binding, and is designed to align stakeholders, docs, and product thinking.

---

## The Core Idea

**Livepeer is an open, decentralized real‑time video + AI compute stack.**

It spans:
- A **crypto‑economic protocol** (incentives, staking, governance)
- A **global GPU network** (supply, routing, performance)
- A **set of developer‑facing products** (APIs, SDKs, apps)

The mistake most people make is collapsing these into one mental bucket.

The OSI‑like model separates *what is guaranteed by the protocol*, *what emerges from the network*, and *what is exposed via products*.

---

## Livepeer OSI‑Like Stack

### Layer 1 — Physical Compute Layer
**(OSI: Physical)**

What it is:
- GPUs, CPUs, memory, bandwidth
- Owned by independent operators
- Heterogeneous hardware (consumer → data‑center grade)

What Livepeer adds:
- Permissionless supply
- Geographic and operator diversity

Not Livepeer‑specific:
- NVIDIA, AMD, bare metal, cloud VMs

---

### Layer 2 — Transport & Media Substrate
**(OSI: Data Link / Transport)**

What it is:
- Video transport, chunking, codecs, streaming primitives
- Frame‑level and stream‑level delivery

Livepeer context:
- Transcoding pipelines
- WebRTC / HLS / RTMP support (via gateways)
- Real‑time frame transport for AI pipelines

This layer is where Livepeer’s *video DNA* lives.

---

### Layer 3 — Distributed Execution Network
**(OSI: Network)**

What it is:
- Job routing
- Load balancing
- Service discovery

Livepeer context:
- Orchestrator selection
- Probabilistic micropayments
- Performance‑weighted routing

Key idea:
> *The network decides **who does the work**, not the protocol.*

---

### Layer 4 — Crypto‑Economic Coordination Protocol
**(OSI: Transport / Session)**

What it is:
- On‑chain logic that secures and coordinates the network

Livepeer protocol primitives:
- LPT staking & delegation
- Inflation‑based rewards
- Fee distribution
- Slashing (where enabled)
- Governance (LIPs, voting)

Key distinction:
> The protocol **does not run jobs** — it **incentivizes correct behavior**.

---

### Layer 5 — Execution & Verification Layer
**(OSI: Session)**

What it is:
- Job execution semantics
- Verification of work
- Settlement of results

Livepeer examples:
- Transcoding verification
- AI inference execution
- Proof‑of‑work‑like mechanisms for media

This is where *“the work actually happens.”*

---

### Layer 6 — Developer & Product Interfaces
**(OSI: Presentation)**

What it is:
- APIs, SDKs, CLIs
- Gateway abstractions

Livepeer examples:
- Gateway APIs
- AI Worker APIs
- SDKs (JS, Python)
- BYOC integrations

Important:
> Products live **above** the network — they are *consumers* of it, not the network itself.

---

### Layer 7 — Applications & Experiences
**(OSI: Application)**

What it is:
- End‑user products
- Creative tools
- Vertical solutions

Livepeer‑powered examples:
- Daydream
- Streamplace
- Real‑time AI avatars
- Interactive video worlds

These are *replaceable and plural* by design.

---

## Mapping Protocol vs Network vs Product

| Concern | Lives Where | Examples |
|------|-----------|---------|
| Security & incentives | Protocol | LPT, staking, inflation |
| Performance & routing | Network | Orchestrators, fees |
| UX & onboarding | Product | APIs, dashboards |
| Creativity & apps | Application | Daydream, studios |

---

## Canonical One‑Sentence Model

> **Livepeer is a crypto‑economic coordination protocol that secures a global, permissionless GPU network optimized for real‑time video and AI, exposed through developer‑friendly products and applications.**

---

## Why This Model Matters

- Prevents protocol ↔ product confusion
- Explains why Livepeer ≠ “just a GPU cloud”
- Helps docs stay modular and future‑proof
- Lets new products slot in *without rewriting the story*

---

## How This Should Be Used in Docs

- Every doc page should declare **which layer(s)** it belongs to
- Protocol docs never reference product UX
- Product docs never redefine protocol rules
- Network concepts always sit between the two

This is the spine the new documentation can hang off.

---

*(This model intentionally aligns with the Livepeer Cascade vision and the documentation RFP goals around clarity, stakeholder separation, and AI‑first structure.)*

