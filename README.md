# Multilingual Query–Category Relevance Classifier

# ETANIMOD Query-Relevance Engine

A multilingual query-category relevance classification system for e-commerce search optimization, built for the IIT BHU Confluentia Hackathon.

## 🎯 Overview

This project addresses the critical challenge of mapping user search queries to relevant product categories across multiple languages in e-commerce platforms. By accurately determining query-category relevance, we help improve search results, user experience, and conversion rates for global e-commerce platforms.

## 🚀 Features

- **Multilingual Support**: Handles queries in 10 languages (English, French, Spanish, Korean, Portuguese, Japanese, German, Italian, Polish, Arabic)
- **Real-time Classification**: Determines if a search query is relevant to a given product category
- **Batch Processing**: Process entire CSV files with thousands of query-category pairs
- **Interactive Demo**: User-friendly Streamlit interface for both batch and single predictions
- **High Performance**: Fine-tuned transformer model achieving competitive F1-scores

## 📋 Problem Statement

E-commerce platforms need to accurately map user search queries (e.g., "red running shoes") to product categories (e.g., Sportswear → Footwear → Running Shoes) across multiple languages. This binary classification task determines whether a query-category pair is:
- **1**: Relevant
- **0**: Not Relevant

## 🛠️ Technical Architecture

### Model
- **Base Model**: DistilBERT Multilingual Cased
- **Architecture**: Fine-tuned for sequence classification with 2 output classes
- **Training Data**: 300,000 labeled samples across 6 languages
- **Evaluation Metric**: F1-score on positive class

### Tech Stack
- **Framework**: PyTorch + Hugging Face Transformers
- **UI**: Streamlit
- **Data Processing**: Pandas, scikit-learn
- **Model Training**: Hugging Face Trainer API

## 📁 Repository Structure

```
etanimod-query-relevance/
├── app.py                 # Streamlit application
├── train.py              # Model training script
├── finetuned_classifier/ # Saved model directory
├── requirements.txt      # Python dependencies
├── README.md            # This file
└── data/                # Dataset directory (not included)
```

## ⚠️ Important Note: Model Files & Deployment

Due to GitHub's 2GB repository size limit, we are unable to host the trained model files directly in this repository. 

**Model Access:**
- The fine-tuned model files are hosted on Google Drive
- The link to access the model files has been shared with the hackathon mentors
- For local deployment, download the `finetuned_classifier` folder from the provided Google Drive link and place it in the project root directory

**For Mentors/Judges:**
- Please check the shared Google Drive link for the complete model files
- The `finetuned_classifier` folder should be downloaded and placed in the same directory as `app.py`
- We will be running the Streamlit app locally during the demo due to these size constraints
- **The provided Google Drive link contains all necessary files to run the application on your systems**
- Simply download the model folder, place it in the project directory, and run `streamlit run app.py`

**Demo Setup:**
1. Clone this repository
2. Download the `finetuned_classifier` folder from the shared Google Drive link
3. Place the folder in the project root directory
4. Install requirements: `pip install -r requirements.txt`
5. Run the app: `streamlit run app.py`

This ensures full reproducibility and allows mentors to test the solution independently on their own machines.


## 🚦 Getting Started

### Prerequisites
- Python 3.8+
- CUDA-capable GPU (optional but recommended)
- 8GB+ RAM

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/etanimod-query-relevance.git
cd etanimod-query-relevance
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

### Training the Model

To train the model on your dataset:

```bash
python train.py --train_csv path/to/train.csv --epochs 3 --batch_size 16
```

Arguments:
- `--train_csv`: Path to training CSV file
- `--model_name`: Pre-trained model name (default: distilbert-base-multilingual-cased)
- `--output_dir`: Directory for checkpoints (default: ./results)
- `--model_save_path`: Final model save directory (default: ./finetuned_classifier)
- `--epochs`: Number of training epochs (default: 1)
- `--batch_size`: Training batch size (default: 16)

### Running the Application

Launch the Streamlit app:

```bash
streamlit run app.py
```

The app provides two main features:

1. **Batch Prediction**: Upload a CSV file with columns `origin_query` and `category_path` to get predictions for all rows
2. **Interactive Demo**: Test individual query-category pairs in real-time

## 📊 Dataset Format

### Input CSV Format
```csv
language,origin_query,category_path,label
en,"wireless headphones","Electronics > Audio Devices > Headphones",1
fr,"chaussures de course","Clothing > Women's > Dresses",0
```

### Output Format
The system outputs a CSV with predictions:
```csv
prediction
1
0
```

## 🎯 Model Performance

The model is evaluated using F1-score on the positive class:

```
F1 = (2 × Precision × Recall) / (Precision + Recall)
```

Expected performance varies by language, with training languages (en, fr, es, ko, pt, ja) typically achieving higher scores than zero-shot languages (de, it, pl, ar).

Looking at the README I provided, I did mention DistilBERT Multilingual Cased in the Technical Architecture section, but I didn't explicitly highlight the transfer learning technique. Let me add a more detailed section about the technical approach:

## 💡 Solution Approach & Techniques

### Transfer Learning Strategy
We leveraged **transfer learning** to solve this multilingual classification task efficiently:

1. **Pre-trained Model**: Started with `distilbert-base-multilingual-cased`
   - Pre-trained on 104 languages with Wikipedia data
   - 66M parameters (40% smaller than BERT-base)
   - Maintains 97% of BERT's performance while being faster

2. **Fine-tuning Process**:
   - Added a classification head on top of DistilBERT
   - Fine-tuned the entire model on our domain-specific e-commerce data
   - This allows the model to adapt from general language understanding to query-category relevance

3. **Why Transfer Learning?**
   - **Multilingual Understanding**: Pre-trained model already understands 104 languages
   - **Zero-shot Capability**: Can handle languages not in training data (German, Italian, Polish, Arabic)
   - **Efficiency**: Requires less training data and time compared to training from scratch
   - **Better Performance**: Leverages knowledge from massive pre-training corpus

### Model Architecture Details
```
Input: Query + [SEP] + Category Path
    ↓
DistilBERT Multilingual (distilbert-base-multilingual-cased)
    ↓
Pooled Output (768 dimensions)
    ↓
Classification Head (Linear + Dropout)
    ↓
Output: Binary Classification (Relevant/Not Relevant)
```

This transfer learning approach allows us to achieve strong performance across all 10 languages while only training on 6 languages.  



## 🤖 AI Tools Used

| AI Tool | Purpose | Description |
|---------|---------|-------------|
| **Claude (Anthropic)** | Code Development & Documentation | Advanced AI assistant used for code optimization, debugging, and creating comprehensive documentation including this README |
| **ChatGPT (OpenAI)** | Problem Analysis & Solution Design | Used for brainstorming solution approaches, analyzing the problem statement, and generating initial code structures |
| **Gemini Pro (Google)** | Model Architecture Research | Leveraged for researching optimal model architectures for multilingual text classification and performance optimization strategies |
| **Gamma.app** | Presentation Creation | AI-powered presentation tool used to create the 5-slide deck for Phase 2 deliverables with professional design and layout |

These AI tools were used to enhance our development process while all core implementation, model training, and system design decisions were made by Team ETANIMOD.

## 🤝 Team ETANIMOD
Bhojraj Sahu, Utkarsh Gupta, Prakhar Yadav
