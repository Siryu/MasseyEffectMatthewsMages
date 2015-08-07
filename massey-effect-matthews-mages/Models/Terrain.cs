using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace massey_effect_matthews_mages.Models
{
    public class Terrain
    {
        public string Image { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }

        public Terrain()
        {

        }

        public Terrain(int xPosition, int yPosition, int width, int height, string image)
        {
            this.X = xPosition;
            this.Y = yPosition;
            this.Width = width;
            this.Height = height;
            this.Image = image;
        }
    }
}