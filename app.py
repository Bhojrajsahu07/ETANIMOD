import streamlit as st
import pandas as pd
from transformers import pipeline
import torch

# --- Page Configuration ---
st.set_page_config(
    page_title="Query-Category Relevance Classifier",
    layout="wide"
)

# --- Load Fine-Tuned Model ---
@st.cache_resource
def load_model(model_path='./finetuned_classifier'):
    """Loads the fine-tuned model and tokenizer."""
    device = 0 if torch.cuda.is_available() else -1
    classifier = pipeline(
        "text-classification",
        model=model_path,
        tokenizer=model_path,
        device=device
    )
    return classifier

st.title("🛍️ E-Commerce: Multilingual Query–Category Relevance")
st.write("This demo uses a fine-tuned model to predict if a search query is relevant to a product category.")

try:
    classifier = load_model()
    st.success("✅ Model loaded successfully!")
except Exception as e:
    st.error(f"Could not load model. Make sure the 'finetuned_classifier' folder exists. Error: {e}")
    st.stop()

# --- File Uploader ---
uploaded_file = st.file_uploader("Upload your test set (CSV)", type=["csv"])

if uploaded_file is not None:
    df_test = pd.read_csv(uploaded_file)
    st.write("Uploaded Data Preview:")
    st.dataframe(df_test.head())

    if st.button("🚀 Run Inference"):
        with st.spinner('Running predictions... This may take a moment.'):
            df_test['text_input'] = df_test['origin_query'] + " [SEP] " + df_test['cate_path']
            texts = df_test['text_input'].tolist()
            
            results = classifier(texts, batch_size=8)
            
            predictions = [int(res['label'].split('_')[1]) for res in results]
            df_test['prediction'] = predictions

            st.write("### Inference Results")
            st.dataframe(df_test[['origin_query', 'cate_path', 'prediction']])

            @st.cache_data
            def convert_df_to_csv(df):
                return df[['prediction']].to_csv(index=False).encode('utf-8')

            csv_data = convert_df_to_csv(df_test)

            st.download_button(
                label="⬇️ Download Predictions as CSV",
                data=csv_data,
                file_name='predictions.csv',
                mime='text/csv',
            )
