#!/usr/bin/env python3
"""Generate Reddit r/realtors research PDF for MLSPhotoTools."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import ListFlowable, ListItem
from datetime import datetime

# Colors
PRIMARY = HexColor("#2563EB")
PRIMARY_DARK = HexColor("#1D4ED8")
PRIMARY_LIGHT = HexColor("#EFF6FF")
SUCCESS = HexColor("#059669")
WARNING = HexColor("#D97706")
DANGER = HexColor("#DC2626")
GRAY_700 = HexColor("#374151")
GRAY_500 = HexColor("#6B7280")
GRAY_300 = HexColor("#D1D5DB")
GRAY_100 = HexColor("#F3F4F6")
MIDNIGHT = HexColor("#0F172A")

OUTPUT_PATH = "/home/user/free-tool-immo/reddit-research/r-realtors-research-2026.pdf"

def build_styles():
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        "Cover Title",
        fontName="Helvetica-Bold",
        fontSize=28,
        leading=34,
        textColor=white,
        alignment=TA_CENTER,
        spaceAfter=10,
    ))
    styles.add(ParagraphStyle(
        "Cover Subtitle",
        fontName="Helvetica",
        fontSize=14,
        leading=18,
        textColor=HexColor("#BFDBFE"),
        alignment=TA_CENTER,
        spaceAfter=6,
    ))
    styles.add(ParagraphStyle(
        "Section Header",
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=20,
        textColor=PRIMARY,
        spaceBefore=18,
        spaceAfter=8,
    ))
    styles.add(ParagraphStyle(
        "Subsection Header",
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=MIDNIGHT,
        spaceBefore=12,
        spaceAfter=4,
    ))
    styles.add(ParagraphStyle(
        "Body",
        fontName="Helvetica",
        fontSize=10,
        leading=15,
        textColor=GRAY_700,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
    ))
    styles.add(ParagraphStyle(
        "Quote",
        fontName="Helvetica-Oblique",
        fontSize=10,
        leading=15,
        textColor=HexColor("#4B5563"),
        leftIndent=16,
        rightIndent=16,
        spaceBefore=4,
        spaceAfter=4,
    ))
    styles.add(ParagraphStyle(
        "Attribution",
        fontName="Helvetica",
        fontSize=8,
        leading=12,
        textColor=GRAY_500,
        leftIndent=16,
        spaceAfter=8,
    ))
    styles.add(ParagraphStyle(
        "Tag",
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=12,
        textColor=PRIMARY,
        spaceAfter=4,
    ))
    styles.add(ParagraphStyle(
        "Callout",
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=14,
        textColor=MIDNIGHT,
        spaceAfter=4,
    ))
    styles.add(ParagraphStyle(
        "Footer",
        fontName="Helvetica",
        fontSize=8,
        leading=10,
        textColor=GRAY_500,
        alignment=TA_CENTER,
    ))
    return styles


def quote_block(text, author, styles):
    """Return a styled blockquote."""
    return [
        Paragraph(f'"{text}"', styles["Quote"]),
        Paragraph(f"— {author}", styles["Attribution"]),
    ]


def callout_box(title, body_text, color, styles):
    """Return a colored callout box as a Table."""
    content = f"<b>{title}</b><br/>{body_text}" if title else body_text
    p = Paragraph(content, ParagraphStyle(
        "CalloutInner",
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=MIDNIGHT,
    ))
    t = Table([[p]], colWidths=[6.5 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), color),
        ("ROUNDEDCORNERS", [6]),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return t


def section_divider():
    return HRFlowable(width="100%", thickness=1, color=GRAY_300, spaceAfter=8, spaceBefore=4)


def build_pdf():
    styles = build_styles()

    # Local wrappers so callers don't need to pass styles
    def qb(text, author):
        return quote_block(text, author, styles)

    def cb(title, body, color=None):
        return callout_box(title, body, color or PRIMARY_LIGHT, styles)

    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        leftMargin=0.9 * inch,
        rightMargin=0.9 * inch,
        topMargin=0.9 * inch,
        bottomMargin=0.9 * inch,
        title="r/realtors Reddit Research – MLSPhotoTools",
        author="MLSPhotoTools",
    )

    story = []

    # ── COVER PAGE ──────────────────────────────────────────────────────────────
    cover_table = Table(
        [[Paragraph("r/realtors Reddit Research", styles["Cover Title"]),
          Paragraph("Photo Tools, Social Media & Agent Workflow Insights", styles["Cover Subtitle"]),
          Paragraph(f"MLSPhotoTools.com  ·  Generated {datetime.now().strftime('%B %d, %Y')}", styles["Cover Subtitle"]),
          ]],
        colWidths=[6.7 * inch],
    )
    cover_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PRIMARY),
        ("ROUNDEDCORNERS", [10]),
        ("TOPPADDING", (0, 0), (-1, -1), 40),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 40),
        ("LEFTPADDING", (0, 0), (-1, -1), 30),
        ("RIGHTPADDING", (0, 0), (-1, -1), 30),
        ("SPAN", (0, 0), (0, 2)),
    ]))

    # Simpler cover - just colored header rows
    cover_data = [
        [Paragraph("r/realtors Reddit Research", styles["Cover Title"])],
        [Paragraph("Photo Tools, Social Media &amp; Agent Workflow Insights", styles["Cover Subtitle"])],
        [Paragraph(f"MLSPhotoTools.com  ·  Generated {datetime.now().strftime('%B %d, %Y')}", styles["Cover Subtitle"])],
    ]
    cover_t = Table(cover_data, colWidths=[6.7 * inch])
    cover_t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PRIMARY),
        ("ROUNDEDCORNERS", [10]),
        ("TOPPADDING", (0, 0), (0, 0), 50),
        ("BOTTOMPADDING", (0, 2), (0, 2), 50),
        ("TOPPADDING", (0, 1), (0, 2), 8),
        ("BOTTOMPADDING", (0, 0), (0, 1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 30),
        ("RIGHTPADDING", (0, 0), (-1, -1), 30),
    ]))
    story.append(Spacer(1, 1.5 * inch))
    story.append(cover_t)
    story.append(Spacer(1, 0.4 * inch))

    # Cover summary box
    summary_box = cb(
        "About This Report",
        "Systematic analysis of r/realtors posts and comments relevant to real estate photo tools, "
        "social media content creation, and agent workflow. Data collected via Pullpush.io archive. "
        "Posts span 2017–2025, with focus on 2024–2025. Includes verbatim quotes, sentiment analysis, "
        "and actionable insights for MLSPhotoTools product development.",
    )
    story.append(summary_box)
    story.append(Spacer(1, 0.3 * inch))

    # Stats row
    stats_data = [
        [
            Paragraph("<b>19+</b><br/>Posts Analyzed", ParagraphStyle("Stat", fontName="Helvetica-Bold", fontSize=13, leading=18, textColor=PRIMARY, alignment=TA_CENTER)),
            Paragraph("<b>8</b><br/>Thread Comments Pulled", ParagraphStyle("Stat", fontName="Helvetica-Bold", fontSize=13, leading=18, textColor=PRIMARY, alignment=TA_CENTER)),
            Paragraph("<b>7</b><br/>Research Topics", ParagraphStyle("Stat", fontName="Helvetica-Bold", fontSize=13, leading=18, textColor=PRIMARY, alignment=TA_CENTER)),
            Paragraph("<b>2024–2025</b><br/>Primary Time Range", ParagraphStyle("Stat", fontName="Helvetica-Bold", fontSize=13, leading=18, textColor=PRIMARY, alignment=TA_CENTER)),
        ]
    ]
    stats_t = Table(stats_data, colWidths=[1.6 * inch] * 4)
    stats_t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), GRAY_100),
        ("ROUNDEDCORNERS", [6]),
        ("TOPPADDING", (0, 0), (-1, -1), 14),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(stats_t)
    story.append(PageBreak())

    # ── TABLE OF CONTENTS ────────────────────────────────────────────────────────
    story.append(Paragraph("Table of Contents", styles["Section Header"]))
    story.append(section_divider())
    toc_items = [
        "1.  Photo Tools & Workflow Pain Points",
        "2.  Watermarks on MLS Listing Photos",
        "3.  Social Media for Realtors",
        "4.  Instagram Reels & Stories",
        "5.  Auto-Generated Branded Social Posts",
        "6.  Listing Photo Quality & Impact on Sales",
        "7.  Virtual Staging Tools",
        "8.  AI Image Enhancement Tools",
        "9.  Automation & Time Drain",
        "10. Agent Branding",
        "11. Competitive Landscape (Tools Mentioned)",
        "12. Key Insights & Product Opportunities",
    ]
    for item in toc_items:
        story.append(Paragraph(item, styles["Body"]))
    story.append(PageBreak())

    # ── SECTION 1: PHOTO TOOLS & WORKFLOW ────────────────────────────────────────
    story.append(Paragraph("1. Photo Tools & Workflow Pain Points", styles["Section Header"]))
    story.append(section_divider())
    story.append(Paragraph(
        "Realtors consistently express frustration with fragmented photo workflows. "
        "Common pain points include: converting HEIC/iPhone photos for MLS upload, "
        "compressing large files to meet MLS file size limits, watermarking for brand protection, "
        "and creating social media posts from listing photos. The community gravitates toward "
        "free or low-cost browser tools over expensive subscriptions.",
        styles["Body"],
    ))

    story.append(Paragraph("Key Thread: \"Best apps for flyers & photos\" (Jan 2025)", styles["Subsection Header"]))
    story += qb("Canva is the standard", "Realtor comment, r/realtors Jan 2025")
    story += qb(
        "Julius [iPhone app] does sky replacement, tv/fire adding, grass, AI eraser and marketing material creation.",
        "Realtor comment"
    )
    story += qb(
        "Adobe Express is available free with Photoshop subscriptions.",
        "Realtor comment"
    )

    story.append(Paragraph("Tools Mentioned for Photo Work:", styles["Subsection Header"]))
    tools_data = [
        ["Tool", "Use Case", "Cost"],
        ["Canva", "Flyers, social templates, overlays", "Free / $13/mo Pro"],
        ["Julius (iPhone)", "Sky replacement, staging, marketing", "Paid app"],
        ["Adobe Express", "Flyers, templates", "Free with Adobe sub"],
        ["Lightroom", "Batch exposure & color editing", "$10/mo"],
        ["Photoshop", "Advanced editing", "$21/mo"],
        ["Moxi Impress", "Listing presentations", "Varies"],
        ["RPR (via MLS)", "Property flyers", "Free via NAR"],
        ["Typorama", "Text overlay on photos", "Mobile app"],
        ["Pic Stitch", "Collage maker", "Mobile app"],
    ]
    tools_t = Table(tools_data, colWidths=[1.5 * inch, 3.0 * inch, 2.0 * inch])
    tools_t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("TEXTCOLOR", (0, 1), (-1, -1), GRAY_700),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, GRAY_100]),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY_300),
    ]))
    story.append(tools_t)
    story.append(Spacer(1, 0.2 * inch))

    story.append(cb(
        "🎯 Opportunity for MLSPhotoTools",
        "Canva is the dominant free tool, but it requires opening a separate app and recreating designs. "
        "A browser tool that handles photo-specific tasks (resize, watermark, overlay, compress) "
        "in one click wins on speed. Realtors want free, simple, and fast — not another subscription.",
        PRIMARY_LIGHT,
    ))
    story.append(PageBreak())

    # ── SECTION 2: WATERMARKS ────────────────────────────────────────────────────
    story.append(Paragraph("2. Watermarks on MLS Listing Photos", styles["Section Header"]))
    story.append(section_divider())
    story.append(Paragraph(
        "A thread specifically about photographer watermarks on MLS photos generated strong consensus. "
        "The community is split between using watermarks for agent branding on social media "
        "vs. the prohibition of watermarks on MLS-submitted listing photos.",
        styles["Body"],
    ))

    story.append(Paragraph("Thread: \"Do watermarks on listing photos cause issues on the MLS?\" (2025)", styles["Subsection Header"]))
    story.append(Paragraph(
        "Original situation: Realtor paid $470 for photos. Photographer delivered watermarked versions, "
        "then charged an additional $450 to remove them.",
        styles["Body"],
    ))

    story += qb(
        "The MLS is not the place for the photographer to be marketing their business, it's to sell the house.",
        "Top comment, r/realtors"
    )
    story += qb(
        "Won't allow you to finish listing before they're removed.",
        "Realtor on MLS watermark policy"
    )
    story += qb(
        "If he didn't know how to price & deliver them, he has no business in the real estate market.",
        "Community response to photographer upcharge"
    )

    story.append(Paragraph("Community Consensus:", styles["Subsection Header"]))
    story.append(Paragraph(
        "• Most MLSs prohibit watermarks on submitted listing photos — violations can prevent listing completion\n"
        "• Watermarks are <b>appropriate and desired</b> on social media versions of listing photos\n"
        "• Professional photographers should deliver clean, watermark-free images as standard\n"
        "• Agents want watermarks for their own branding (logo, contact info) on social posts",
        styles["Body"],
    ))

    story.append(cb(
        "🎯 Opportunity",
        "Two distinct workflows: (1) Strip watermarks before MLS upload — our Remove EXIF tool partially covers this. "
        "(2) Add agent branding watermark for social media versions — our Batch Watermark Photos tool covers this. "
        "Messaging should emphasize: 'clean photos for MLS, branded photos for social.'",
        PRIMARY_LIGHT,
    ))
    story.append(Spacer(1, 0.2 * inch))

    # ── SECTION 3: SOCIAL MEDIA ───────────────────────────────────────────────────
    story.append(Paragraph("3. Social Media for Realtors", styles["Section Header"]))
    story.append(section_divider())
    story.append(Paragraph(
        "The r/realtors community has a nuanced and sometimes skeptical view of social media's ROI "
        "for selling homes. However, they universally acknowledge its value for agent branding and "
        "lead generation — which drives demand for content creation tools.",
        styles["Body"],
    ))

    story.append(Paragraph("Thread: \"Social media presence\" (May 2025)", styles["Subsection Header"]))
    story += qb(
        "Social media doesn't convert to sales, it converts to reputation.",
        "r/realtors comment"
    )
    story += qb(
        "Not a single one, including one that is doing extremely well on TikTok and YouTube, "
        "has said social media sold one of their listings.",
        "Experienced agent"
    )
    story += qb(
        "Posting listings serves the agent, not your house.",
        "r/realtors comment"
    )

    story.append(Paragraph("What Realtors Actually Use Social Media For:", styles["Subsection Header"]))
    social_data = [
        ["Purpose", "Sentiment"],
        ["Agent credibility / reputation building", "✅ Strong consensus"],
        ["Lead generation", "✅ Moderate success"],
        ["Selling specific listings", "❌ Very low success rate"],
        ["Personal brand / thought leadership", "✅ Long-term value"],
        ["Open house promotion", "⚠️ 0.5% of sales from open houses"],
        ["Just Listed / Just Sold posts", "✅ Credibility building"],
    ]
    social_t = Table(social_data, colWidths=[4.2 * inch, 2.3 * inch])
    social_t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("TEXTCOLOR", (0, 1), (-1, -1), GRAY_700),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, GRAY_100]),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY_300),
    ]))
    story.append(social_t)
    story.append(Spacer(1, 0.2 * inch))

    story.append(cb(
        "🎯 Implication for MLSPhotoTools",
        "Frame our tools around agent branding and reputation, not 'sell more homes faster.' "
        "Realtors know social media builds their brand — they need fast, free tools to create "
        "professional-looking content without Canva's learning curve.",
        PRIMARY_LIGHT,
    ))
    story.append(PageBreak())

    # ── SECTION 4: INSTAGRAM REELS ───────────────────────────────────────────────
    story.append(Paragraph("4. Instagram Reels & Stories", styles["Section Header"]))
    story.append(section_divider())
    story.append(Paragraph(
        "Realtors recognize Reels as the highest-reach format on Instagram. However, "
        "the community emphasizes authenticity over polished production — personal moments, "
        "neighborhood content, and genuine commentary outperform generic templates.",
        styles["Body"],
    ))

    story.append(Paragraph("Thread: Lead Generation Tips (Oct 2022, score: 19, 23 comments)", styles["Subsection Header"]))
    story += qb(
        "You don't have to be an absolute whizz to make content.",
        "r/realtors lead generation thread (top-voted)"
    )
    story += qb(
        "Be authentic and have fun on social. If you're only posting work stuff, it's pretty boring. "
        "I'm working more on reels since those get pushed out more.",
        "chigal10, realtor"
    )

    story.append(Paragraph(
        "Key insights: Reels get organic push from Instagram's algorithm. "
        "Agents mixing personal content with listing photos see better engagement. "
        "9:16 vertical format is essential for Stories and Reels.",
        styles["Body"],
    ))

    story.append(cb(
        "🎯 Opportunity",
        "Our Social Media Photo Formatter (9:16 Stories format) directly addresses this need. "
        "The text overlay addition (Just Listed, Just Sold presets) makes it even more powerful. "
        "Consider adding a 'Reel thumbnail' or short vertical slideshow template as a future feature.",
        PRIMARY_LIGHT,
    ))
    story.append(Spacer(1, 0.2 * inch))

    # ── SECTION 5: AUTO-GENERATED SOCIAL POSTS ────────────────────────────────────
    story.append(Paragraph("5. Auto-Generated Branded Social Posts", styles["Section Header"]))
    story.append(section_divider())
    story.append(Paragraph(
        "Two separate posts in 2025 asked whether auto-generated branded social posts for realtors "
        "would be a viable product. The community response was largely skeptical but revealing.",
        styles["Body"],
    ))

    story.append(Paragraph("Post 1: \"Is it worth building in 2025: auto-generates branded social media posts?\"", styles["Subsection Header"]))
    story += qb(
        "Personally, I wouldn't pay for it because it just doesn't perform well on social media.",
        "Independent-Bison-81"
    )
    story += qb(
        "My marketing team already does this with humans.",
        "PlzbuffRakiThenNerf"
    )
    story += qb(
        "Large franchises already have such tools; suggested exploring unique alternatives instead.",
        "StickInEye"
    )
    story += qb(
        "Commission-based workers are unlikely to pay for another marketing tool when it's not a major pain point.",
        "Mushrooming247"
    )
    story += qb(
        "$150+/month per MLS, 500+ MLSs nationwide, ~$1M annual API costs, plus development complexity.",
        "7HawksAnd — on MLS API cost barriers"
    )

    story.append(cb(
        "🎯 Insight: Free Wins, Subscriptions Lose",
        "The community explicitly rejects paying for another subscription. However, a FREE browser-based tool "
        "that does one thing well (resize/format/overlay a listing photo in 10 seconds) fills the gap between "
        "'I won't pay $150/mo' and 'I'm spending 20 minutes in Canva.' That's our exact positioning.",
        SUCCESS,
    ))
    story.append(PageBreak())

    # ── SECTION 6: LISTING PHOTO QUALITY ─────────────────────────────────────────
    story.append(Paragraph("6. Listing Photo Quality & Impact on Sales", styles["Section Header"]))
    story.append(section_divider())

    story.append(Paragraph("Thread: \"What I've Learned About Listing Photos After 5+ Years\" (Score: 7)", styles["Subsection Header"]))
    story += qb(
        "12 inquiries in 48 hours. Same price. Same layout. After professional photos.",
        "r/realtors, thread about photo impact"
    )
    story += qb(
        "Traditional staging in my price points is generally way too expensive and not worth it.",
        "RealtorFacts"
    )
    story += qb(
        "Virtual staging always looks like it was sourced from the Walmart sale section.",
        "Chrystal_PDX_Realtor"
    )

    story.append(Paragraph("Thread: \"Why are some homes with great photos sitting for weeks\" (Score: 37, 90 comments)", styles["Subsection Header"]))
    story += qb(
        "Since when do photos sell houses? They hook you into scheduling a showing.",
        "GarbageBoyJr"
    )
    story += qb(
        "Photos can be misleading — they pick the most flattering angles to make it seem bigger, bring in extra lighting.",
        "rosered936"
    )
    story += qb(
        "You can't see smells. I saw a beautiful house. Great photos. Overwhelming dog/smoke smells. Walked out.",
        "NYVines"
    )

    story.append(Paragraph(
        "Community Consensus on Photo Quality:",
        styles["Subsection Header"],
    ))
    story.append(Paragraph(
        "• Professional photos dramatically increase showing requests\n"
        "• Photos hook buyers into scheduling a showing — they don't sell the home\n"
        "• AI/virtual staging skepticism is high — authenticity matters\n"
        "• Price and condition ultimately determine sales outcome\n"
        "• Quick brightness/contrast fixes on iPhone photos are common DIY need",
        styles["Body"],
    ))

    story.append(cb(
        "🎯 Opportunity: Photo Enhancer",
        "The Photo Enhancer tool we just built directly addresses agents who take their own photos "
        "(especially on iPhone) and need basic brightness/contrast fixes before MLS upload. "
        "Position it as: 'Get professional-looking photos without hiring an editor.'",
        PRIMARY_LIGHT,
    ))
    story.append(Spacer(1, 0.2 * inch))

    # ── SECTION 7: VIRTUAL STAGING TOOLS ─────────────────────────────────────────
    story.append(Paragraph("7. Virtual Staging Tools", styles["Section Header"]))
    story.append(section_divider())
    story.append(Paragraph(
        "Thread: \"Any good virtual staging tools that don't look like crap?\" (8 comments, 2025). "
        "Despite community skepticism about AI staging quality, specific tools were recommended.",
        styles["Body"],
    ))

    staging_data = [
        ["Tool", "Price Point", "Community Rating"],
        ["Box Brownie", "Paid, human editors", "Most recommended"],
        ["ApplyDesign.io", "Under $10/image", "Good quality, cost-effective"],
        ["VirtualStagingAI.app", "Under $1/image", "Decent for margins"],
        ["Professional photographer staging", "$50 extra", "Best quality"],
    ]
    staging_t = Table(staging_data, colWidths=[2.2 * inch, 2.0 * inch, 2.3 * inch])
    staging_t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("TEXTCOLOR", (0, 1), (-1, -1), GRAY_700),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, GRAY_100]),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY_300),
    ]))
    story.append(staging_t)
    story.append(Spacer(1, 0.2 * inch))
    story += qb(
        "Most are problematic unless you have lots of practice.",
        "Community member on AI staging tools"
    )
    story.append(PageBreak())

    # ── SECTION 8: AI IMAGE ENHANCEMENT ──────────────────────────────────────────
    story.append(Paragraph("8. AI Image Enhancement Tools", styles["Section Header"]))
    story.append(section_divider())
    story.append(Paragraph(
        "Two duplicate posts asked: \"Would a tool that enhances real estate images using AI be useful?\" "
        "(Posted May 2025). The responses were measured — the tool concept was validated but market "
        "demand was questioned.",
        styles["Body"],
    ))

    story += qb(
        "There are several companies around that already do this along with free tools as well. "
        "Nothing wrong with putting another tool out there but you'll want to monetize it somehow.",
        "HappyPillow2000"
    )
    story += qb(
        "While the 'after' photo definitely looks better, not sure how much of a market there is "
        "within the real estate community.",
        "RationalLies"
    )

    story.append(cb(
        "🎯 Implication",
        "The AI framing creates skepticism. Our Photo Enhancer is positioned as simple brightness/contrast sliders "
        "— not AI. This is more trustworthy to the community. The 'before/after' comparison tool is validated by "
        "the community's interest in showing improvement.",
        SUCCESS,
    ))
    story.append(Spacer(1, 0.2 * inch))

    # ── SECTION 9: AUTOMATION & TIME DRAIN ───────────────────────────────────────
    story.append(Paragraph("9. Automation & Time Drain", styles["Section Header"]))
    story.append(section_divider())
    story.append(Paragraph(
        "Two threads directly asked what realtors want to automate. "
        "Photo-related tasks appeared alongside administrative work.",
        styles["Body"],
    ))

    story.append(Paragraph("Thread: \"What's the one task in real estate you wish you could automate?\"", styles["Subsection Header"]))
    automation_data = [
        ["Task", "Comment"],
        ["Paperwork", '"Paperwork!!" — Howiecum22'],
        ["Entering listings into MLS", '"Entering listings into the MLS." — Nakagura775'],
        ["Mailers for expired listings", '"I just spent all morning doing mailers..." — Mis_skully13'],
        ["Lead follow-up", '"Leads searching, talking to leads, follow-ups..." — Crafty_Wishbone_8700'],
    ]
    auto_t = Table(automation_data, colWidths=[2.0 * inch, 4.5 * inch])
    auto_t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("TEXTCOLOR", (0, 1), (-1, -1), GRAY_700),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, GRAY_100]),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY_300),
    ]))
    story.append(auto_t)
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph("Thread: \"Realtors – What's Draining Your Time That Could Be Handled by AI?\"", styles["Subsection Header"]))
    story += qb("So what parts of it are helping them close faster or get more listings?", "cvc4455")
    story += qb(
        "When realtors figure out they can chat with their MLS listings, client emails, and calendars via LLMs "
        "they will throw their money at you.",
        "smx501"
    )

    story.append(cb(
        "🎯 Implication",
        "Photo prep is not listed as a top time drain — it's a small but annoying task. "
        "This confirms our positioning: make it SO fast (< 30 seconds) that it's a no-brainer, "
        "not a tool requiring adoption or habit change.",
        PRIMARY_LIGHT,
    ))
    story.append(PageBreak())

    # ── SECTION 10: AGENT BRANDING ────────────────────────────────────────────────
    story.append(Paragraph("10. Agent Branding", styles["Section Header"]))
    story.append(section_divider())
    story.append(Paragraph(
        "Thread: \"Agent branding and logo?\" (2021, Score: 3, 9 comments). "
        "Consensus strongly favors independent agent branding, especially for career flexibility.",
        styles["Body"],
    ))

    story += qb(
        "Yes, it is completely normal to have your own brand and logo, even as an individual agent. "
        "Personal branding increases recognition and professionalism.",
        "philipos357"
    )
    story += qb(
        "Agents should maintain independent branding, email, website, and phone number separate from "
        "brokerage systems. This protects your business if you change companies.",
        "Ordinary_Awareness71"
    )
    story += qb(
        "Most states require all advertising must be approved by a principal/managing broker.",
        "DHumphreys — on legal constraints"
    )

    story.append(cb(
        "🎯 Implication for MLSPhotoTools",
        "Agent branding tools (our Batch Watermark, Agent Branding Bar) have strong demand. "
        "The brand logo auto-detect color feature we built directly supports this workflow. "
        "Position branding tools as career protection: 'Your brand survives your brokerage.'",
        PRIMARY_LIGHT,
    ))
    story.append(Spacer(1, 0.2 * inch))

    # ── SECTION 11: COMPETITIVE LANDSCAPE ────────────────────────────────────────
    story.append(Paragraph("11. Competitive Landscape (Tools Mentioned)", styles["Section Header"]))
    story.append(section_divider())

    comp_data = [
        ["Tool", "Category", "Mention Frequency", "Sentiment"],
        ["Canva", "Design / templates", "High (most mentioned)", "Positive — 'standard'"],
        ["Box Brownie", "Virtual staging", "Medium", "Positive — 'does very well'"],
        ["Julius (iPhone)", "Photo editing", "Low", "Positive — unique features"],
        ["Adobe Express", "Design", "Low", "Positive — free with sub"],
        ["ApplyDesign.io", "Virtual staging", "Low", "Positive — cheap"],
        ["VirtualStagingAI", "Virtual staging", "Low", "Neutral"],
        ["BeFunky", "Batch resize", "Low (industry articles)", "Neutral"],
        ["Moxi Impress", "Listings/pres", "Low", "Positive — 'underrated'"],
        ["Lightroom", "Photo editing", "Low", "Professional"],
        ["RPR (NAR tool)", "Flyers", "Low", "Free option"],
    ]
    comp_t = Table(comp_data, colWidths=[1.5 * inch, 1.5 * inch, 1.8 * inch, 1.7 * inch])
    comp_t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("TEXTCOLOR", (0, 1), (-1, -1), GRAY_700),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, GRAY_100]),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY_300),
    ]))
    story.append(comp_t)
    story.append(Spacer(1, 0.2 * inch))

    story.append(Paragraph(
        "Key Gap: No single free browser tool covers the full realtor photo workflow "
        "(resize → compress → watermark → overlay → social format). Canva handles templates but "
        "is not purpose-built for real estate photo tasks. MLSPhotoTools fills this gap.",
        styles["Body"],
    ))
    story.append(PageBreak())

    # ── SECTION 12: KEY INSIGHTS ──────────────────────────────────────────────────
    story.append(Paragraph("12. Key Insights & Product Opportunities", styles["Section Header"]))
    story.append(section_divider())

    insights = [
        {
            "title": "🏆 Free Wins Every Time",
            "body": "Realtors explicitly reject paid subscriptions for photo tools. "
                    "'An app that's actually useful that isn't taking any money from me!' "
                    "is the winning value proposition. Our 100% free positioning is validated.",
            "color": SUCCESS,
        },
        {
            "title": "📱 Canva is the Baseline — Speed Beats Features",
            "body": "Canva is universally known but slow for real estate-specific tasks. "
                    "A tool that does one thing in 10 seconds (not 10 minutes) wins on "
                    "convenience even if Canva has more features.",
            "color": PRIMARY,
        },
        {
            "title": "🖼️ MLS vs. Social = Two Separate Workflows",
            "body": "Clean, unbranded photos go to MLS. Watermarked, overlaid, "
                    "formatted photos go to social media. Tools serving both audiences "
                    "should be clearly labeled for each use case.",
            "color": WARNING,
        },
        {
            "title": "📸 Photo Quality Is a Credibility Issue",
            "body": "Dark, compressed, or flat listing photos hurt agent credibility. "
                    "Realtors who shoot their own iPhone photos need fast enhancement tools. "
                    "Professional photographers handle their own editing — target the DIY segment.",
            "color": PRIMARY,
        },
        {
            "title": "🤖 Avoid 'AI' Framing",
            "body": "The community is skeptical of AI tools and sees them as gimmicks or "
                    "compliance risks (MLS deceptive advertising rules). Frame tools as "
                    "'simple browser tools' not 'AI-powered solutions.'",
            "color": DANGER,
        },
        {
            "title": "📊 Before/After Content is High Value",
            "body": "Renovation and staging transformations are compelling social content. "
                    "Our Before/After tool addresses a real need: showcasing property "
                    "transformations that generate engagement and demonstrate agent value.",
            "color": SUCCESS,
        },
        {
            "title": "🎯 Instagram Reels = Biggest Organic Reach",
            "body": "Agents know Reels get pushed out by the algorithm. "
                    "9:16 vertical format tools (our Social Media Formatter) are essential. "
                    "Adding text overlays to vertical photos is a direct time-saver.",
            "color": PRIMARY,
        },
    ]

    for ins in insights:
        story.append(cb(ins["title"], ins["body"], PRIMARY_LIGHT))
        story.append(Spacer(1, 0.1 * inch))

    story.append(Spacer(1, 0.3 * inch))
    story.append(section_divider())

    # Priority matrix
    story.append(Paragraph("Product Priority Matrix (Based on Reddit Signal)", styles["Subsection Header"]))
    priority_data = [
        ["Tool", "Community Signal", "Priority"],
        ["Batch Watermark Photos", "High — branding demand, MLS compliance clarity needed", "🔴 High"],
        ["Photo Enhancer (new)", "High — iPhone photo fixes, dark interiors", "🔴 High"],
        ["Social Formatter + text (enhanced)", "High — Reels, 9:16, overlays", "🔴 High"],
        ["Listing Status Overlays", "High — Just Listed/Sold for social", "🔴 High (exists)"],
        ["Before/After Comparison (new)", "Medium — renovation content", "🟡 Medium"],
        ["HEIC to JPG Converter", "Medium — iPhone workflow", "🟡 Medium"],
        ["Remove EXIF Data", "Low explicit mention — compliance", "🟢 Low"],
        ["Virtual Staging", "High demand but complex — out of scope", "⛔ Out of scope"],
    ]
    prio_t = Table(priority_data, colWidths=[2.0 * inch, 3.5 * inch, 1.0 * inch])
    prio_t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), MIDNIGHT),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("TEXTCOLOR", (0, 1), (-1, -1), GRAY_700),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, GRAY_100]),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("GRID", (0, 0), (-1, -1), 0.5, GRAY_300),
    ]))
    story.append(prio_t)
    story.append(Spacer(1, 0.3 * inch))

    # Footer
    story.append(section_divider())
    story.append(Paragraph(
        f"MLSPhotoTools.com  ·  r/realtors Research Report  ·  Generated {datetime.now().strftime('%B %d, %Y')}  ·  "
        "Data sourced from Pullpush.io (Reddit archive) and web research.",
        styles["Footer"],
    ))

    doc.build(story)
    print(f"✅ PDF generated: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()
