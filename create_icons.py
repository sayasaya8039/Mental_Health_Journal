"""
Mental Health Journal アイコン生成スクリプト
パステル水色系のハートアイコンを生成
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size: int, output_path: str) -> None:
    """
    指定サイズのアイコンを生成する

    Args:
        size: アイコンのサイズ（ピクセル）
        output_path: 出力ファイルパス
    """
    # 透明な背景
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 背景の円（パステル水色）
    padding = size // 10
    bg_color = (56, 189, 248, 255)  # #38BDF8
    draw.ellipse([padding, padding, size - padding, size - padding], fill=bg_color)

    # ハートの描画
    heart_size = size * 0.5
    center_x = size // 2
    center_y = size // 2 + size // 20

    # ハートの形状を計算
    heart_points = []
    import math
    for t in range(0, 360, 5):
        rad = math.radians(t)
        # ハートの数式
        x = 16 * (math.sin(rad) ** 3)
        y = -(13 * math.cos(rad) - 5 * math.cos(2 * rad) - 2 * math.cos(3 * rad) - math.cos(4 * rad))

        # スケーリングと位置調整
        scale = heart_size / 35
        px = center_x + x * scale
        py = center_y + y * scale
        heart_points.append((px, py))

    # ハートを描画（白色）
    if len(heart_points) > 2:
        draw.polygon(heart_points, fill=(255, 255, 255, 255))

    img.save(output_path)
    print(f"Created: {output_path} ({size}x{size})")


def main():
    # 出力ディレクトリの確認
    icons_dir = os.path.join(os.path.dirname(__file__), "public", "icons")
    os.makedirs(icons_dir, exist_ok=True)

    # 各サイズのアイコンを生成
    sizes = [16, 32, 48, 128, 192, 512]

    for size in sizes:
        output_path = os.path.join(icons_dir, f"icon-{size}.png")
        create_icon(size, output_path)

    # favicon.ico も生成（16x16）
    favicon_path = os.path.join(os.path.dirname(__file__), "public", "favicon.ico")
    img_16 = Image.open(os.path.join(icons_dir, "icon-16.png"))
    img_16.save(favicon_path, format="ICO")
    print(f"Created: {favicon_path}")

    print("\n✅ アイコン生成完了！")


if __name__ == "__main__":
    main()
