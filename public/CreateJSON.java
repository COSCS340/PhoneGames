import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class CreateJSON {

	public CreateJSON() throws IOException {
		
		File[] files = new File("src/Celebrity").listFiles();
		BufferedWriter writer = new BufferedWriter(new FileWriter("cards.json"));
		
		writer.write("{\"cards\":[");
		for (int i =0; i < files.length; i++) {
			writer.write("{");
			writer.write("\"title\":\"" + files[i].getName().substring(0, files[i].getName().length()-4) + "\",");
			writer.write("\"points\":" + 1 + ",");
			writer.write("\"safe\":\"sfw\",");
			writer.write("\"path\":\"/Celebrity/" + files[i].getName() + "\"");
			writer.write("}");
			if (i != files.length-1)
				writer.write(",");
		}
		
		writer.write("]}");
		writer.close();
	}

	public static void main(String[] args) {
		try {
			new CreateJSON();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
