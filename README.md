# Multilingual Query–Category Relevance Classifier

[cite_start]This project is a solution for the IIT BHU Hackathon's "Multilingual Query–Category Relevance" problem[cite: 1]. It uses a fine-tuned multilingual transformer model to classify whether a given search query is relevant to a product category path.

## [cite_start]1. Solution Approach [cite: 46]

[cite_start]The core of this solution is a **binary classification model**[cite: 22]. [cite_start]Given the multilingual nature of the dataset and the requirement to generalize to unseen languages[cite: 18], I chose to fine-tune a pre-trained multilingual model (`sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`).

This approach works because:
- The model has already been trained on dozens of languages, including those not present in our training set (like German, Italian, etc.).
- [cite_start]Fine-tuning adapts this general language understanding to the specific task of predicting query-category relevance, using the 300,000 provided training samples[cite: 17].
- The input to the model is a concatenation of the `origin_query` and `cate_path`, separated by a `[SEP]` token, allowing the model to effectively compare their semantic relationship.

[cite_start]The model's performance is evaluated based on the **F1-score** on the positive class (`label=1`)[cite: 25, 27].

## [cite_start]2. Setup and Execution Instructions [cite: 47]

### Step 1: Clone the Repository & Install Dependencies
```bash
# Clone this repository (if applicable)
# git clone ...

# Install the required Python packages
pip install -r requirements.txt
```

### Step 2: Train the Model
Place your training data (e.g., `train.csv`) in the root directory. Then, run the training script:
```bash
python train.py --train_csv train.csv
```
This will start the fine-tuning process and save the final model artifacts to a directory named `./finetuned_classifier`.

### Step 3: Run the Streamlit Demo
Once the model is trained and saved, you can launch the web application:
```bash
streamlit run app.py
```
Open your browser to the local URL provided by Streamlit. You can then upload a test CSV file to get predictions.

## 3. Assumptions [cite: 48]
- The input CSV files for training and testing will always contain the columns `origin_query` and `cate_path`.
- The pre-trained model from Hugging Face is sufficient to handle the syntax and vocabulary of the unseen languages.
