# Mapping User Queries To Categories

## Problem Statement

E-commerce platforms operating globally face a critical challenge: accurately mapping user search queries in 20+ languages to English product categories. This mismatch leads to poor search relevance for non-English speakers, lost revenue from failed product discovery, and frustrated customers abandoning carts.

**Our Solution**: A fine-tuned multilingual transformer model that understands search intent across languages and maps queries to the right product categories with high accuracy.

## Key Features

- **Multilingual Support**: Works with 20+ languages using DistilBERT multilingual
- **Transformer-based**: Fine-tuned on domain-specific e-commerce data
- **High Accuracy**: Optimized for F1-score on positive class
- **Production Ready**: Saved model can be directly deployed
- **Easy Integration**: Streamlit UI for demo and testing

## Setup and Execution

### 1. Install Dependencies
Create a virtual environment and run:
```bash
pip install -r requirements.txt
