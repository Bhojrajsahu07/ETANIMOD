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

## 💡 Solution Approach

1. **Data Preprocessing**: Concatenate query and category with [SEP] token
2. **Model Selection**: DistilBERT Multilingual for efficiency and multilingual capability
3. **Fine-tuning**: Train on 300K samples with 90/10 train-validation split
4. **Inference**: Batch processing with optimized batch sizes
5. **UI/UX**: Clean, intuitive Streamlit interface for accessibility

## 🤝 Team ETANIMOD
Bhojraj Sahu, Utkarsh Gupta, Prakhar Yadav
