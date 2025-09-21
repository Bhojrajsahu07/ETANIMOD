# app.py

import streamlit as st
import pandas as pd
from transformers import pipeline
import torch

# --- 1. Page Configuration and Custom Styling ---
st.set_page_config(
    page_title="ETANIMOD | Query Relevance Engine",
    page_icon="🛍️",
    layout="wide",
)

# Custom CSS to inject for a more beautiful design
def local_css(file_name):
    with open(file_name) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

# You would create a style.css file with the content below
# For this example, I'm embedding it directly
custom_css = """
<style>
    /* Main app background */
    .stApp {
        background-color: #f0f2f6;
    }
    /* Button styles */
    .stButton>button {
        border: 2px solid #4A4A4A;
        border-radius:10px;
        color: #4A4A4A;
        background-color: #FFFFFF;
        padding: 10px 20px;
        font-weight: bold;
    }
    .stButton>button:hover {
        border: 2px solid #0d6efd;
        color: #0d6efd;
    }
    /* Sidebar styles */
    .css-1d391kg {
        background-color: #FFFFFF;
    }
    /* Container styles */
    .st-emotion-cache-183lzff {
        border: 1px solid #e6e6e6;
        border-radius: 10px;
        padding: 20px;
        background-color: #FFFFFF;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
    }
</style>
"""
st.markdown(custom_css, unsafe_allow_html=True)


# --- 2. Model Loading Function (Cached) ---
@st.cache_resource
def load_model(model_path='./finetuned_classifier'):
    """Loads the fine-tuned model and tokenizer."""
    try:
        classifier = pipeline("text-classification", model=model_path, device=0 if torch.cuda.is_available() else -1)
        return classifier
    except Exception as e:
        return e

classifier = load_model()

# --- 3. Header and Sidebar ---
# Main title with branding
st.title("🛍️ ETANIMOD Query-Relevance Engine")
st.write("A sophisticated tool to determine the relevance between search queries and product categories.")

# Sidebar branding and interactive controls
st.sidebar.title("Controls & Options")
st.sidebar.markdown("---")
# Add a logo if you have one
# st.sidebar.image("your_logo.png", width=150)
st.sidebar.info("Built by **Team ETANIMOD** for the IIT BHU Confluentia Hackathon.")


# --- 4. Main App Logic ---
if isinstance(classifier, Exception):
    st.error("Could not load the model. Please ensure the 'finetuned_classifier' directory exists.")
    st.error(f"Error details: {classifier}")
else:
    # Use tabs for a clean separation of functionality
    tab1, tab2 = st.tabs(["📁 Batch Prediction (CSV)", "🚀 Interactive Demo"])

    # --- Interactive Demo Tab ---
    with tab1:
        st.header("Process a CSV File")
        uploaded_file = st.file_uploader("Upload your test set", type=["csv"], key="csv_uploader")

        if uploaded_file is not None:
            df_test = pd.read_csv(uploaded_file)
            st.write("Uploaded Data Preview:")
            st.dataframe(df_test.head())

            if st.button("Run Batch Inference", key="batch_button"):
                with st.spinner('Running predictions on the file...'):
                    df_test['text_input'] = df_test['origin_query'] + " [SEP] " + df_test['category_path'] # Use your actual column names
                    texts = df_test['text_input'].tolist()
                    results = classifier(texts, batch_size=8)
                    predictions = [int(res['label'].split('_')[1]) for res in results]
                    df_test['prediction'] = predictions

                    st.success("Inference complete!")
                    st.dataframe(df_test)
                    
                    csv_data = df_test[['prediction']].to_csv(index=False).encode('utf-8')
                    st.download_button(
                        label="Download Predictions",
                        data=csv_data,
                        file_name='predictions.csv',
                        mime='text/csv',
                    )
    with tab2:
        st.header("Live Relevance Checker")
        
        # Inputs moved to the sidebar for a cleaner look
        st.sidebar.header("Interactive Demo")
        categories = [
            "Clothing > Men's > Shirts", "Clothing > Women's > Dresses",
            "Electronics > Computers & Accessories > Laptops", "Electronics > Mobile Phones",
            "Home & Kitchen > Furniture", "Sports & Outdoors > Fitness"
        ]
        search_query = st.sidebar.text_input("Enter a search query:", placeholder="e.g., red running shoes")
        selected_category = st.sidebar.selectbox("Choose a product category:", categories)

        if st.sidebar.button("Check Relevance"):
            if not search_query:
                st.warning("Please enter a search query.")
            else:
                with st.spinner("Analyzing relevance..."):
                    text_input = f"{search_query} [SEP] {selected_category}"
                    result = classifier(text_input)[0]
                    prediction_label = int(result['label'].split('_')[1])
                    confidence_score = result['score']

                st.subheader("Analysis Result")
                col1, col2 = st.columns(2)
                
                if prediction_label == 1:
                    col1.success("Verdict: Relevant")
                    
                    st.write(f"Showing mock results for **'{search_query}'**...")
                    p_col1, p_col2, p_col3 = st.columns(3)
                    with p_col1:
                        st.image("https://via.placeholder.com/250/cde4ff/0d6efd?Text=Product", caption="Generic Product 1")
                    with p_col2:
                        st.image("https://via.placeholder.com/250/cde4ff/0d6efd?Text=Product", caption="Generic Product 2")
                    with p_col3:
                        st.image("https://via.placeholder.com/250/cde4ff/0d6efd?Text=Product", caption="Generic Product 3")
                else:
                    col1.error("Verdict: Not Relevant")
                    st.warning(f"No results found for **'{search_query}'** in **'{selected_category}'**.")

    # --- Batch Prediction Tab ---