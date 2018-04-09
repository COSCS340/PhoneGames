import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;


public class ImageCropper {

	public ImageCropper() throws IOException {
		
		File f = new File("src/images");
		File[] files = f.listFiles();
		
		for (int i=0; i < files.length; i++) {
			Image src = ImageIO.read(files[i]);

			int w = 628-191, h = 762-99;
			int[] xs = {190, 633, 1075, 190, 633, 1075, 190, 633, 1075};
			int[] ys = {99, 99, 99, 766, 766, 766, 1435, 1435, 1435};
			
			for (int j=0; j < 9; j++) {
				BufferedImage dst = new BufferedImage(w, h, BufferedImage.TYPE_INT_ARGB);
				dst.getGraphics().drawImage(src, 0, 0, w, h, xs[j], ys[j], xs[j] + w, ys[j] + h, null);
				ImageIO.write(dst, "png", new File("card" + (i*9 + j) + ".png"));
			}
		}
	}

	public static void main(String[] args) {
		try {
			new ImageCropper();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
