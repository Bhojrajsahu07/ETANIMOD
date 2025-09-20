import pandas as pd
from datasets import Dataset, DatasetDict
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
import argparse
from sklearn.model_selection import train_test_split

def main(args):
    """
    Main function to run the model training and evaluation pipeline.
    """
    print("--- Starting Model Training ---")

    # 1. Load and Prepare Data
    print(f"Loading dataset from {args.train_csv}...")
    df = pd.read_csv(args.train_csv)
    df['text_input'] = df['origin_query'] + " [SEP] " + df['cate_path']
    print("Data prepared with 'text_input' column.")

    # Split data into training and validation sets (90% train, 10% validation)
    train_df, val_df = train_test_split(df, test_size=0.1, random_state=42, stratify=df['label'])

    train_dataset = Dataset.from_pandas(train_df)
    val_dataset = Dataset.from_pandas(val_df)
    
    # Combine into a DatasetDict for the Trainer
    ds = DatasetDict({
        'train': train_dataset,
        'validation': val_dataset
    })

    # 2. Load Tokenizer and Model
    print(f"Loading pre-trained model and tokenizer: {args.model_name}...")
    tokenizer = AutoTokenizer.from_pretrained(args.model_name)
    model = AutoModelForSequenceClassification.from_pretrained(args.model_name, num_labels=2)

    # 3. Tokenize Dataset
    def tokenize_function(examples):
        return tokenizer(examples["text_input"], padding="max_length", truncation=True)

    print("Tokenizing datasets...")
    tokenized_ds = ds.map(tokenize_function, batched=True)
    tokenized_ds = tokenized_ds.rename_column("label", "labels")
    tokenized_ds.set_format("torch", columns=["input_ids", "attention_mask", "labels"])

    # 4. Define Training Arguments
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        per_device_eval_batch_size=args.batch_size,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=100,
        evaluation_strategy="epoch", # Evaluate at the end of each epoch
        save_strategy="epoch",      # Save a checkpoint at the end of each epoch
        load_best_model_at_end=True, # Load the best model based on validation loss
    )

    # 5. Initialize and Run Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_ds['train'],
        eval_dataset=tokenized_ds['validation'], # Provide the validation set
    )

    print("--- Starting fine-tuning ---")
    trainer.train()
    print("--- Fine-tuning complete ---")

    # 6. Save the final best model and tokenizer
    print(f"Saving final model to {args.model_save_path}...")
    trainer.save_model(args.model_save_path)
    tokenizer.save_pretrained(args.model_save_path)
    print("Model saved successfully!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fine-tune a multilingual model for query-category classification.")
    parser.add_argument('--train_csv', type=str, required=True, help='Path to the training CSV file.')
    parser.add_argument('--model_name', type=str, default='distilbert-base-multilingual-cased', help='Name of the pre-trained model.')
    parser.add_argument('--output_dir', type=str, default='./results', help='Directory for checkpoints.')
    parser.add_argument('--model_save_path', type=str, default='./finetuned_classifier', help='Directory to save the final model.')
    parser.add_argument('--epochs', type=int, default=1, help='Number of training epochs.')
    parser.add_argument('--batch_size', type=int, default=16, help='Training batch size.')
    
    args = parser.parse_args()
    main(args)
