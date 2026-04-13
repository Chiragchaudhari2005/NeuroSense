import os
import uuid
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle

INTERPRETATIONS = {
    "NonDemented": "No significant cognitive decline detected. The brain structures appear typical and healthy for the indicated age with no prominent anomalies indicative of dementia.",
    "VeryMildDemented": "Early signs of cognitive impairment detected. There are very mild structural changes which might be part of normal age-related progression or the earliest indications of cognitive decline.",
    "MildDemented": "Moderate cognitive decline detected. The scan shows structural alterations consistent with mild dementia. This typically correlates with noticeable memory difficulties and changes in daily functioning.",
    "ModerateDemented": "Advanced cognitive impairment detected. The scan indicates significant structural abnormalities indicative of moderate to severe dementia, heavily impacting cognitive and functional abilities."
}

RECOMMENDATIONS = {
    "NonDemented": "Continue maintaining a healthy lifestyle, including regular physical exercise, a balanced diet, and cognitive activities. Ensure routine annual health check-ups and proactively monitor any changes in memory or daily functioning. Stay engaged socially and manage daily stress effectively.",
    "VeryMildDemented": "Consider scheduling a comprehensive cognitive assessment with a healthcare professional to establish a clinical baseline. Adopt preventative lifestyle modifications such as the Mediterranean diet, regular aerobic exercise, and mentally stimulating activities. Discuss the potential benefits of cognitive training programs.",
    "MildDemented": "We strongly advise consulting a neurologist or geriatric specialist for a formal evaluation and potential early interventions. Begin discussing long-term care planning and establishing a supportive environment to minimize confusion. Evaluate the home for safety improvements and involve family members in daily care routines and medication management.",
    "ModerateDemented": "Immediate consultation with a specialized medical team is critical to formulate a comprehensive care plan. Consider exploring memory care services or professional caregiving support. Ensure a structured daily routine, maximize home safety by removing hazard risks, and access support groups for caregivers. Regular professional assistance with activities of daily living is highly recommended."
}

def create_report(image_path: str, predicted_class: str, confidence: float, output_dir: str):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    report_id = str(uuid.uuid4())
    pdf_path = os.path.join(output_dir, f"{report_id}.pdf")
    
    # Increase margins for a cleaner look
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
    styles = getSampleStyleSheet()
    
    brand_color = colors.HexColor("#2563EB") # Blue
    text_dark = colors.HexColor("#1F2937")
    text_muted = colors.HexColor("#4B5563")

    # Custom Styles
    title_style = ParagraphStyle(
        'TitleStyle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=brand_color,
        alignment=1, # Center
        spaceAfter=30
    )
    
    heading_style = ParagraphStyle(
        'HeadingStyle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=brand_color,
        spaceBefore=15,
        spaceAfter=10,
        borderPadding=5,
    )
    
    body_style = ParagraphStyle(
        'BodyStyle',
        parent=styles['Normal'],
        fontSize=11,
        textColor=text_dark,
        leading=16,
        spaceAfter=12
    )
    
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=text_muted,
        alignment=1,
        spaceBefore=30
    )
    
    elements = []
    
    # 1. Header Title
    elements.append(Paragraph("<b>NeuroSense Medical Assessment</b>", title_style))
    
    # 2. Patient / Scan Info (using a clean Table for layout)
    scan_date = datetime.now().strftime('%B %d, %Y - %H:%M')
    
    info_data = [
        [Paragraph("<b>Report ID:</b>", body_style), Paragraph(f"{report_id}", body_style)],
        [Paragraph("<b>Date of Analysis:</b>", body_style), Paragraph(f"{scan_date}", body_style)],
        [Paragraph("<b>Diagnostic Class:</b>", body_style), Paragraph(f"<font color='{brand_color}'><b>{predicted_class}</b></font>", body_style)]
    ]
    
    info_table = Table(info_data, colWidths=[120, 380])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F3F4F6")),
        ('PADDING', (0,0), (-1,-1), 10),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
    ]))
    
    elements.append(info_table)
    elements.append(Spacer(1, 20))
    
    # 3. MRI Scan Image Display
    elements.append(Paragraph("<b>MRI Scan Overview</b>", heading_style))
    if os.path.exists(image_path):
        img_table = Table([[Image(image_path, width=3.5*72, height=3.5*72)]])
        img_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('BOX', (0,0), (-1,-1), 2, colors.HexColor("#E5E7EB")),
            ('PADDING', (0,0), (-1,-1), 10)
        ]))
        elements.append(img_table)
    else:
        elements.append(Paragraph("<i>Image unavailable.</i>", body_style))
    
    elements.append(Spacer(1, 20))

    # 4. Clinical Interpretation
    interpretation = INTERPRETATIONS.get(predicted_class, "Unknown classification.")
    elements.append(Paragraph("<b>Clinical Interpretation</b>", heading_style))
    elements.append(Paragraph(interpretation, body_style))
    
    # 5. Expert Recommendations
    recommendation = RECOMMENDATIONS.get(predicted_class, "Please consult a healthcare provider.")
    elements.append(Paragraph("<b>Recommended Next Steps & Care Plan</b>", heading_style))
    elements.append(Paragraph(recommendation, body_style))

    # 6. Educational Information
    elements.append(Spacer(1, 15))
    elements.append(Paragraph("<b>Understanding Dementia Classifications</b>", heading_style))
    
    intro_text = (
        "Dementia is a broad term describing a decline in mental ability severe enough to interfere with daily life. "
        "To help patients and caregivers understand the progression, medical professionals classify cognitive decline into distinct diagnostic stages:"
    )
    elements.append(Paragraph(intro_text, body_style))
    
    bullet_style = ParagraphStyle(
        'BulletStyle',
        parent=body_style,
        leftIndent=15,
        spaceAfter=10
    )
    
    elements.append(Paragraph("• <b>Non-Demented:</b> No evidence of cognitive decline. The individual's brain structures and memory function remain typical for their age without significant impairments.", bullet_style))
    elements.append(Paragraph("• <b>Very Mild Demented:</b> Early subtle changes and subjective memory complaints. Individuals may temporarily misplace things, but symptoms are rarely apparent during clinical evaluation or to friends and family. This can be normal aging or the earliest possible signs of Alzheimer's.", bullet_style))
    elements.append(Paragraph("• <b>Mild Demented:</b> Clear-cut signs of early decline. Close friends or family begin to notice frequent forgetfulness. Individuals may have trouble finding words, planning tasks, or organizing schedules.", bullet_style))
    elements.append(Paragraph("• <b>Moderate Demented:</b> Significant decline in cognitive abilities. Individuals face major gaps in memory and require persistent assistance with complex day-to-day activities. They may forget personal historical details and get easily confused by time or place.", bullet_style))

    # 7. Disclaimer Footer
    disclaimer = ("<b>DISCLAIMER:</b> This report was generated using Artificial Intelligence image analysis. "
                  "It is intended solely as an adjunctive decision-support tool and DOES NOT constitute a definitive medical diagnosis. "
                  "Always seek the advice of a physician or qualified healthcare provider with any questions you may have regarding a medical condition.")
    elements.append(Spacer(1, 30))
    elements.append(Paragraph(disclaimer, footer_style))
    
    doc.build(elements)
    
    return report_id, pdf_path

def create_full_report(patient_data, cognitive_data, mri_data, final_data, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    report_id = str(uuid.uuid4())
    pdf_path = os.path.join(output_dir, f"{report_id}.pdf")
    
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
    styles = getSampleStyleSheet()
    
    brand_color = colors.HexColor("#2563EB")
    text_dark = colors.HexColor("#1F2937")
    text_muted = colors.HexColor("#4B5563")

    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], fontSize=24, textColor=brand_color, alignment=1, spaceAfter=30)
    heading_style = ParagraphStyle('HeadingStyle', parent=styles['Heading2'], fontSize=16, textColor=brand_color, spaceBefore=15, spaceAfter=10)
    body_style = ParagraphStyle('BodyStyle', parent=styles['Normal'], fontSize=11, textColor=text_dark, leading=16, spaceAfter=12)
    footer_style = ParagraphStyle('Footer', parent=styles['Normal'], fontSize=9, textColor=text_muted, alignment=1, spaceBefore=30)
    
    elements = []
    
    elements.append(Paragraph("<b>NeuroSense Multimodal Assessment</b>", title_style))
    
    # Patient Details
    sex_str = "Male" if patient_data['gender'] == 1 else "Female"
    scan_date = datetime.now().strftime('%B %d, %Y - %H:%M')
    
    elements.append(Paragraph("<b>Patient Details</b>", heading_style))
    p_data = [
        [Paragraph("<b>Patient ID:</b>", body_style), Paragraph(f"{report_id}", body_style)],
        [Paragraph("<b>Scan Date:</b>", body_style), Paragraph(f"{scan_date}", body_style)],
        [Paragraph("<b>Age:</b>", body_style), Paragraph(f"{patient_data['age']}", body_style)],
        [Paragraph("<b>Gender:</b>", body_style), Paragraph(f"{sex_str}", body_style)],
        [Paragraph("<b>Education (Years):</b>", body_style), Paragraph(f"{patient_data['education']}", body_style)],
        [Paragraph("<b>SES (1-5):</b>", body_style), Paragraph(f"{patient_data['ses']}", body_style)],
    ]
    p_table = Table(p_data, colWidths=[150, 350])
    p_table.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#F3F4F6")), ('PADDING', (0,0), (-1,-1), 8), ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB"))]))
    elements.append(p_table)
    elements.append(Spacer(1, 15))
    
    # Cognitive Assessment
    elements.append(Paragraph("<b>Cognitive Assessment</b>", heading_style))
    c_level = "Low Risk" if cognitive_data['probability'] < 0.3 else ("High Risk" if cognitive_data['probability'] > 0.85 else "Medium Risk")
    c_data = [
        [Paragraph("<b>Cognitive Score / MMSE:</b>", body_style), Paragraph(f"{cognitive_data['cognitive_score']} (Mapped: {cognitive_data['mmse_score']}/30)", body_style)],
        [Paragraph("<b>Cognitive Risk Probability:</b>", body_style), Paragraph(f"{cognitive_data['probability']*100:.2f}%", body_style)],
        [Paragraph("<b>Cognitive Risk Level:</b>", body_style), Paragraph(f"{c_level}", body_style)],
    ]
    c_table = Table(c_data, colWidths=[200, 300])
    c_table.setStyle(TableStyle([('PADDING', (0,0), (-1,-1), 8)]))
    elements.append(c_table)
    elements.append(Spacer(1, 15))
    
    # MRI Analysis
    elements.append(Paragraph("<b>MRI Analysis</b>", heading_style))
    if os.path.exists(mri_data['image_path']):
        elements.append(Image(mri_data['image_path'], width=2.5*72, height=2.5*72))
    
    interpretation = INTERPRETATIONS.get(mri_data['predicted_class'], "Unknown")
    
    m_data = [
        [Paragraph("<b>Predicted Dementia Class:</b>", body_style), Paragraph(f"{mri_data['predicted_class']}", body_style)],
        [Paragraph("<b>Interpretation:</b>", body_style), Paragraph(f"{interpretation}", body_style)]
    ]
    m_table = Table(m_data, colWidths=[150, 350])
    m_table.setStyle(TableStyle([('PADDING', (0,0), (-1,-1), 8)]))
    elements.append(m_table)
    elements.append(Spacer(1, 15))
    
    # Combined AI Assessment
    elements.append(Paragraph("<b>Combined AI Assessment</b>", heading_style))
    elements.append(Paragraph(f"<b>Final Risk Score:</b> {final_data['final_score']*100:.2f}%", body_style))
    elements.append(Paragraph(f"<b>Final Risk Category:</b> <font color='{brand_color}'>{final_data['final_risk_category']}</font>", body_style))
    elements.append(Paragraph("<b>AI Decision Explanation:</b> Final risk derived from both cognitive indicators and MRI structural analysis.", body_style))
    elements.append(Spacer(1, 15))
    
    # Recommendations
    elements.append(Paragraph("<b>Recommendations</b>", heading_style))
    if final_data['final_risk_category'] == "Low Risk":
         rec = "Routine monitoring"
    elif final_data['final_risk_category'] == "Medium Risk":
         rec = "Neurologist consultation advised"
    else:
         rec = "Immediate clinical evaluation required"
         
    elements.append(Paragraph(rec, body_style))
    
    # Disclaimer
    elements.append(Spacer(1, 30))
    disclaimer = "<b>DISCLAIMER:</b> This report is AI-generated and for research assistance only."
    elements.append(Paragraph(disclaimer, footer_style))
    
    doc.build(elements)
    
    return report_id, pdf_path
