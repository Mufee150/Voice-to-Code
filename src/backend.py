from flask import Flask, request, jsonify
from code_generator import CodeGenerator  # Your Python script

app = Flask(__name__)
generator = CodeGenerator()

@app.route("/generate_code", methods=["POST"])
def generate_code():
    data = request.json
    user_input = data.get("text_input", "")
    
    if not user_input:
        return jsonify({"error": "No input provided"}), 400
    
    generated_code = generator.generate_code(user_input)
    
    if generated_code:
        return jsonify({"generated_code": generated_code})
    else:
        return jsonify({"error": "Failed to generate code"}), 500

if __name__ == "__main__":
    app.run(debug=True)
