import streamlit as st
import pandas as pd
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch

# --- Page Configuration ---
st.set_page_config(
    page_title="Query-Category Relevance Classifier",
    layout="wide"
)

# --- Load Fine-Tuned Model ---
# Use st.cache_resource to load the model only once
@st.cache_resource
def load_model(model_path='./finetuned_classifier'):
    """Loads the fine-tuned model and tokenizer."""
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForSequenceClassification.from_pretrained(model_path)
    # Use GPU if available
    device = 0 if torch.cuda.is_available() else -1
    classifier = pipeline(
        "text-classification",
        model=model,
        tokenizer=tokenizer,
        device=device,
        return_all_scores=False # Simpler output
    )
    return classifier

st.title("🛍️ E-Commerce: Multilingual Query–Category Relevance")
st.write("This demo uses a fine-tuned multilingual model to predict if a search query is relevant to a product category.")

try:
    classifier = load_model()
    st.success("✅ Model loaded successfully!")
except Exception as e:
    st.error(f"Could not load model. Make sure the 'finetuned_classifier' directory exists. Error: {e}")
    st.stop()


# --- File Uploader ---
uploaded_file = st.file_uploader("Upload your test set (CSV)", type=["csv"])

if uploaded_file is not None:
    df_test = pd.read_csv(uploaded_file)
    st.write("Uploaded Data Preview:")
    st.dataframe(df_test.head())

    if st.button("🚀 Run Inference"):
        with st.spinner('Running predictions... This may take a moment.'):
            # Prepare input texts
            df_test['text_input'] = df_test['origin_query'] + " [SEP] " + df_test['cate_path']
            texts = df_test['text_input'].tolist()
            
            # Run inference in batches
            results = classifier(texts, batch_size=8)
            
            # Process results (classifier outputs a dict like {'label': 'LABEL_1', 'score': 0.99})
            predictions = [int(res['label'].split('_')[1]) for res in results]
            df_test['prediction'] = predictions

            # Display results
            st.write("### Inference Results")
            st.dataframe(df_test[['origin_query', 'cate_path', 'prediction']])

            # Provide download option for the predictions
            @st.cache_data
            def convert_df_to_csv(df):
                # Only keep the prediction column as per typical submission formats
                return df[['prediction']].to_csv(index=False).encode('utf-8')

            csv_data = convert_df_to_csv(df_test)

            st.download_button(
                label="⬇️ Download Predictions as CSV",
                data=csv_data,
                file_name='predictions.csv',
                mime='text/csv',
            )


#To create a fine tune classifier for streamlit to store all model weights + tokenizer
model_path='./finetuned_classifier'
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)
