# Mapping User Queries To Categories

## Problem Statement

E-commerce platforms operating globally face a critical challenge: accurately mapping user search queries in 20+ languages to English product categories. This mismatch leads to poor search relevance for non-English speakers, lost revenue from failed product discovery, and frustrated customers abandoning carts.

## Problem Understanding  

E-commerce search engines need to map user queries (e.g., *"red running shoes"*) to the correct product category (e.g., *Sportswear → Footwear → Running Shoes*) to deliver relevant results quickly.  

This project tackles the problem as a **binary classification task** where the model predicts if a given query–category pair is:  
- **1 → Relevant**  
- **0 → Not Relevant**  

A key challenge is the **multilingual nature** of the data. The model must perform well not only on languages seen during training (like **English, French, Spanish, Korean, Portuguese, Japanese**) but also generalize to **unseen languages** (like **German, Italian, Polish, Arabic**) in the test set.  

The final model performance will be evaluated using the **F1-score for the positive class (Relevant)**.  


**Our Solution**: A fine-tuned multilingual transformer model that understands search intent across languages and maps queries to the right product categories with high accuracy.

## Key Features

- **Multilingual Support**: Works with 20+ languages using DistilBERT multilingual
- **Transformer-based**: Fine-tuned on domain-specific e-commerce data
- **High Accuracy**: Optimized for F1-score on positive class
- **Production Ready**: Saved model can be directly deployed
- **Easy Integration**: Streamlit UI for demo and testing  


- ## Solution Approach

Our approach centers on fine-tuning a pre-trained multilingual transformer model to understand the semantic relationship between search queries and category paths.

1.  **Model Selection**: We chose **`distilbert-base-multilingual-cased`**. This model is ideal for the task because:
    * It has been pre-trained on a large corpus of languages, giving it a strong foundation for understanding the provided languages.
    * Its multilingual nature allows it to generalize well to the languages that are not present in the training set (a zero-shot learning scenario).
    * It is a "distilled" version of BERT, offering a great balance between high performance and computational efficiency, which is crucial for faster training and inference in a hackathon setting.

2.  **Input Formulation**: To enable the model to compare the query and the category path, we concatenate them into a single string, separated by a special `[SEP]` token. This format (`query [SEP] category_path`) is standard for sentence-pair classification tasks and helps the model's attention mechanism learn the relationship between the two text segments.

3.  **Training**: We use the Hugging Face `transformers` and `datasets` libraries for a robust training pipeline.
    * The provided training data is split into a 90% training set and a 10% validation set to monitor performance and prevent overfitting.
    * The `Trainer` API handles the fine-tuning process, with evaluation performed at the end of each epoch to save the best-performing model checkpoint.

4.  **Inference & Deployment**: A user-friendly web application is built using **Streamlit** as required for Phase . This demo allows for easy uploading of the test set, running inference, displaying results, and downloading the predictions in the required format.

---

## Repository Structure 
├── data/ # (Optional) Placeholder for training/test data  
├── app.py # Streamlit application for inference and demo  
├── train.py # Script for fine-tuning the model  
├── requirements.txt # Python dependencies for the project  
└── README.md # This file  


---

## ⚙️ Setup and Instructions

Follow these steps to set up the environment and run the code.

### 1. Clone the Repository
git clone <your-repo-url>
cd <your-repo-name>

### REFERENCES :
## 🤖 AI Models Used

| Model            | Description                   |
|------------------|-------------------------------|
| Gemini 2.5 Pro   | Google’s multimodal LLM       |
| Claude       | Anthropic's LLM |
| GPT-5            | OpenAI’s advanced LLM         |


















---

##  Team Contact

* **Team Name:** ETANIMOD
* **Members:** Bhojraj Sahu, Utkarsh Gupta, Prakhar Yadav, Ayush Mishra
* **Hackathon:** Confluentia Hackathon 2025

---
