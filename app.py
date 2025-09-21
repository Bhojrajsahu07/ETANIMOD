import streamlit as st
import pandas as pd
from transformers import pipeline
import torch

# --- 1. Page Configuration and Theming ---
st.set_page_config(
    page_title="ETANIMOD | Query Relevance Engine",
    page_icon="🛍️",
    layout="wide",
)

# Custom CSS that uses Streamlit's theme variables for full light/dark mode compatibility
custom_css = """
<style>
    /* Style for the containers inside the tabs */
    .st-emotion-cache-183lzff {
        border: 1px solid rgba(49, 51, 63, 0.2); /* Use theme's faint text color for border */
        border-radius: 10px;
        padding: 20px;
        background-color: var(--secondary-background-color); /* This color adapts to the theme */
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
    }
    
    /* Style for the main action button in the sidebar */
    .stButton>button {
        width: 100%;
        border-radius: 10px;
        border: 2px solid var(--primary-color);
        color: var(--primary-color);
        background-color: transparent; /* Makes the button background transparent */
    }
    .stButton>button:hover {
        border-color: var(--primary-color);
        color: white; /* Text color on hover */
        background-color: var(--primary-color); /* Background color on hover */
    }
</style>
"""
st.markdown(custom_css, unsafe_allow_html=True)


# --- 2. Model Loading Function ---
@st.cache_resource
def load_model(model_path='./finetuned_classifier'):
    """Loads the fine-tuned model from the local directory."""
    try:
        classifier = pipeline("text-classification", model=model_path, device=0 if torch.cuda.is_available() else -1)
        return classifier
    except Exception as e:
        return e

classifier = load_model()

# --- 3. Header and Sidebar ---
st.title("🛍️ ETANIMOD Query-Relevance Engine")
st.write("A sophisticated tool to determine the relevance between search queries and product categories.")

st.sidebar.title("Controls & Options")
st.sidebar.markdown("---")
st.sidebar.info("Built by **Team ETANIMOD** for the IIT BHU Hackathon.")


# --- 4. Main App Logic ---
if isinstance(classifier, Exception):
    st.error("Could not load the model. Please ensure the 'finetuned_classifier' directory exists.")
    st.error(f"Error details: {classifier}")
else:
    # Using tabs to separate the two functionalities
    tab1, tab2 = st.tabs(["🚀 Interactive Demo", "📁 Batch Prediction (CSV)"])

    # --- Batch Prediction Tab ---
    with tab1:

        st.header("Process a CSV File")
        uploaded_file = st.file_uploader("Upload your test set", type=["csv"], key="csv_uploader")

        if uploaded_file is not None:
            df_test = pd.read_csv(uploaded_file)
            st.dataframe(df_test.head())

            if st.button("Run Batch Inference", key="batch_button"):
                with st.spinner('Running predictions on the file...'):
                    # IMPORTANT: Use your actual column names here
                    df_test['text_input'] = df_test['origin_query'] + " [SEP] " + df_test['cate_path'] 
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











    # --- Interactive Demo Tab ---
    with tab2:
        st.header("Live Relevance Checker")
        
        st.sidebar.header("Interactive Demo Controls")
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
                    col2.metric(label="Confidence Score", value=f"{confidence_score:.2%}")
                    
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
                    col2.metric(label="Confidence Score", value=f"{confidence_score:.2%}")
                    st.warning(f"No results found for **'{search_query}'** in the **'{selected_category}'** category.")