import pandas as pd
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
import argparse

def main(args):
    """
    Main function to run the model training pipeline.
    """
    print("--- Starting Model Training ---")

    # 1. Load and Prepare Data
    print(f"Loading dataset from {args.train_csv}...")
    df_train = pd.read_csv(args.train_csv)
    
    df_train['text_input'] = df_train['origin_query'] + " [SEP] " + df_train['cate_path']
    print("Data prepared with 'text_input' column.")

    dataset = Dataset.from_pandas(df_train)

    # 2. Load Tokenizer and Model
    print(f"Loading pre-trained model and tokenizer: {args.model_name}...")
    tokenizer = AutoTokenizer.from_pretrained(args.model_name)
    model = AutoModelForSequenceClassification.from_pretrained(args.model_name, num_labels=2)

    # 3. Tokenize Dataset
    def tokenize_function(examples):
        return tokenizer(examples["text_input"], padding="max_length", truncation=True)

    print("Tokenizing dataset...")
    tokenized_dataset = dataset.map(tokenize_function, batched=True)
    
    tokenized_dataset = tokenized_dataset.rename_column("label", "labels")

    # 4. Define Training Arguments
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=100,
        save_strategy="epoch",
        evaluation_strategy="no",
    )

    # 5. Initialize and Run Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
    )

    print("--- Starting fine-tuning ---")
    trainer.train()
    print("--- Fine-tuning complete ---")

    # 6. Save the final model and tokenizer
    print(f"Saving final model to {args.model_save_path}...")
    model.save_pretrained(args.model_save_path)
    tokenizer.save_pretrained(args.model_save_path)
    print("Model saved successfully!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fine-tune a multilingual model for query-category classification.")
    parser.add_argument('--train_csv', type=str, required=True, help='Path to the training CSV file.')
    
    # --- THIS IS THE ONLY LINE THAT CHANGED ---
    # We are now using a smaller, distilled model to save memory.
    parser.add_argument('--model_name', type=str, default='distilbert-base-multilingual-cased', help='Name of the pre-trained model from Hugging Face.')
    
    parser.add_argument('--output_dir', type=str, default='./results', help='Directory to save training outputs and checkpoints.')
    parser.add_argument('--model_save_path', type=str, default='./finetuned_classifier', help='Directory to save the final fine-tuned model.')
    parser.add_argument('--epochs', type=int, default=1, help='Number of training epochs.')
    parser.add_argument('--batch_size', type=int, default=16, help='Training batch size per device.')
    
    args = parser.parse_args()
    main(args)
