from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
import os

class CodeGenerator:
    def __init__(self):
        """Initialize with Salesforce CodeGen model"""
        print("Loading model...")
        self.model_name = "Salesforce/codegen-350M-mono"
        self.output_file = os.path.join(os.getcwd(), "output.py")  # Full path to output file
        
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModelForCausalLM.from_pretrained(self.model_name)
            print("Model loaded successfully!")
            
            # Create output file if it doesn't exist
            if not os.path.exists(self.output_file):
                with open(self.output_file, 'w') as f:
                    f.write("# Generated Python Functions\n\n")
                print(f"Created output file at: {self.output_file}")
        except Exception as e:
            print(f"Error during initialization: {e}")
            raise

    def generate_code(self, text_input):
        """Generate code from text input with improved prompting"""
        try:
            # More specific prompt formatting
            prompt = f"""# Write a Python function that will: {text_input}
# The function should be focused only on this specific task.
# Here is the implementation:

def"""
            
            # Tokenize
            inputs = self.tokenizer(prompt, return_tensors="pt")
            
            # Generate with stricter parameters
            outputs = self.model.generate(
                inputs["input_ids"],
                max_length=200,
                min_length=50,
                temperature=0.1,
                top_p=0.9,
                top_k=50,
                num_return_sequences=1,
                do_sample=True,
                no_repeat_ngram_size=2
            )
            
            # Decode and clean up
            generated_code = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
            # Extract just the function
            if "def" in generated_code:
                start_idx = generated_code.find("def")
                end_idx = len(generated_code)
                
                # Find where the function ends (next def or EOF)
                next_def = generated_code.find("def", start_idx + 1)
                if next_def != -1:
                    end_idx = next_def
                
                generated_code = generated_code[start_idx:end_idx].strip()
                
                # Ensure the code ends with a newline
                if not generated_code.endswith('\n'):
                    generated_code += '\n'
            
            return generated_code
            
        except Exception as e:
            print(f"Generation error: {e}")
            return None

    def append_to_file(self, code):
        """Append the generated code to the output file"""
        if not code:
            print("No code to save!")
            return False
        
        try:
            # Create file if it doesn't exist
            if not os.path.exists(self.output_file):
                with open(self.output_file, 'w') as f:
                    f.write("# Generated Python Functions\n\n")
            
            # Append the code with proper spacing
            with open(self.output_file, 'a') as f:
                f.write("\n\n")  # Add spacing between functions
                f.write(code)
            
            print(f"\nCode successfully appended to {self.output_file}")
            
            # Verify the file was updated
            if os.path.exists(self.output_file):
                file_size = os.path.getsize(self.output_file)
                print(f"File size: {file_size} bytes")
            
            return True
            
        except Exception as e:
            print(f"Error saving to file: {e}")
            print(f"Attempted to save to: {self.output_file}")
            print(f"Current working directory: {os.getcwd()}")
            return False

def main():
    try:
        # Initialize generator
        generator = CodeGenerator()
        
        while True:
            print("\nEnter what you want the function to do (or 'quit' to exit):")
            user_input = input("> ").strip()
            
            if user_input.lower() == 'quit':
                break
                
            if not user_input:
                print("Please enter a valid input!")
                continue
            
            print("\nGenerating code...")
            generated_code = generator.generate_code(user_input)
            
            if generated_code:
                # Display in terminal
                print("\nGenerated Code:")
                print(generated_code)
                
                # Save to file
                if generator.append_to_file(generated_code):
                    print("\nYou can find  here your code in:", generator.output_file)
                else:
                    print("\nWarning: Code was generated but could not be saved to file.")
            else:
                print("Failed to generate code. Please try again.")
                
    except Exception as e:
        print(f"An error occurred in main: {e}")

if __name__ == "__main__":
    main()