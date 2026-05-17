import { PromptState } from '../types';

export const generatePrompt = (state: PromptState): { mainPrompt: string, negativePrompt: string } => {
  const isRodor = state.preset === 'thai_rodor';
  
  let subject = '';
  let clothing = '';
  let hair = '';
  let background = '';
  let lighting = '';
  let composition = '';
  let cameraAngle = '';
  let expression = '';
  let skinGrooming = '';
  let quality = '';
  let preservationRules = '';
  let negativePrompt = '';
  
  const genderStr = state.gender === 'male' ? 'male ' : state.gender === 'female' ? 'female ' : '';
  const ageStr = state.ageImpression ? `${state.ageImpression} ` : '';

  if (isRodor) {
    subject = `Subject: Create a formal Thai student military training portrait from the reference image. Preserve the exact facial identity, face shape, age impression, and natural proportions. The subject is a ${ageStr}${genderStr}student.`;
    clothing = `Clothing: The subject is wearing a Thai "ชุด ร.ด." uniform. Keep the uniform neat, properly aligned, and crisp. Remove visual wrinkles and make the clothing look clean and well-structured. Preserve all original insignia, badges, symbols, and logos exactly as they are. Do not change, redesign, replace, or remove any insignia or logo. Make sure all important uniform marks remain clearly visible and complete.`;
    background = `Background: Use a clean studio-style background suitable for an official portrait.`;
    lighting = `Lighting: Use balanced professional studio lighting, soft and even, with clear facial detail and no harsh shadows.`;
    composition = `Composition: Show a half-body portrait with enough visible upper body area so the user can crop later manually. Keep the shoulders level, straight, and properly proportioned. The framing must be suitable for later use as a 1-inch ID photo while still showing the full relevant upper uniform area and insignia clearly.`;
    cameraAngle = `Camera Angle: Front-facing, eye-level, official portrait framing.`;
    expression = `Expression: Neutral and formal expression, natural closed mouth, calm appearance.`;
    skinGrooming = `Skin / Grooming: Keep natural skin texture. Reduce oily shine. Avoid red or overly flushed skin. Keep the face clean, fresh, and realistic.`;
    quality = `Quality: High-resolution, sharp, commercial-ready portrait, realistic texture, clean edges, balanced color.`;
    preservationRules = `Preservation rules: Do not change facial identity. Do not distort body proportions. Do not crop out important uniform insignia. Do not modify any badge, symbol, or logo.`;
    
    negativePrompt = `wrinkled uniform, messy clothing, drooping shoulders, uneven shoulders, cropped insignia, missing badges, altered logo, changed insignia, distorted face, deformed anatomy, oily skin, shiny face, red face, blurry details, soft focus, low resolution, plastic skin, oversmoothed skin, bad proportions, warped body, messy hair, asymmetrical composition, messy hair, long hair, overgrown hair, hair covering ears, hair covering forehead, untidy sideburns, thick bulky hair, fluffy hair, trendy hairstyle, fashion hairstyle, wet hair look, unrealistic hairline, distorted hair, asymmetrical haircut`;
  } else {
    subject = `Subject: Create a formal portrait of a ${ageStr}${genderStr}individual.`;
    clothing = `Clothing: The subject is wearing ${state.uniformType || 'formal attire'}. Keep the clothing neat and well-structured.`;
    background = `Background: ${state.backgroundType || 'Use a clean studio-style background.'}`;
    lighting = `Lighting: Use balanced professional studio lighting.`;
    composition = `Composition: ${state.showUpperBody ? 'Show a half-body portrait.' : 'Show an official portrait framing.'} ${state.framingType}`;
    cameraAngle = `Camera Angle: Front-facing, eye-level.`;
    expression = `Expression: ${state.expression || 'Neutral and formal.'}`;
    skinGrooming = `Skin / Grooming: Natural skin texture. ${state.skinCorrectionLevel}`;
    quality = `Quality: High-resolution, sharp, commercial-ready portrait.`;
    preservationRules = `Preservation rules: ${state.strictIdentity ? 'Do not change facial identity.' : ''} ${state.preserveInsignia ? 'Preserve any insignia or logo exactly as shown.' : ''}`;
    
    negativePrompt = `bad anatomy, distorted face, ugly, messy clothes, poor lighting, low res, soft focus, blurry, messy hair`;
  }

  // Hair logic
  if (state.hairStylePreset === 'rodor_standard') {
    hair = `Hair: Use a neat Thai military student regulation crew cut. Keep the hair short, clean, disciplined, and realistic. The haircut should be appropriate for Thai "ร.ด." style, with tidy sides, a clean hairline, open ears, and a proper formal appearance.`;
  } else if (state.hairStylePreset === 'very_short_buzz') {
    hair = `Hair: Use a very short regulation buzz cut, clean and even, with a disciplined official appearance. Keep the haircut realistic and suitable for a Thai military student portrait.`;
  } else if (state.hairStylePreset === 'short_undercut') {
    hair = `Hair: Use a short regulation undercut / short tapered haircut, neat and properly controlled, with open ears and a clean neckline. Keep the appearance formal and appropriate for Thai military student standards.`;
  } else if (state.hairStylePreset === 'open_ears_neckline') {
    hair = `Hair: Keep the hair short and tidy with clearly visible ears and a clean neckline. Maintain a disciplined and regulation-appropriate appearance for a Thai military student portrait.`;
  } else if (state.hairStylePreset === 'preserve_and_clean') {
    hair = `Hair: Preserve the original hairstyle direction but clean it up into a neat, short, regulation-appropriate form. Make it look tidy, disciplined, and suitable for a formal Thai student military portrait.`;
  } else {
    hair = state.hairCleanupNote ? `Hair: ${state.hairCleanupNote}` : '';
  }

  let finalPrompt = `
${subject}

${clothing}
`;

  if (hair) {
    finalPrompt += `
${hair}
`;
  }

  finalPrompt += `
${background}

${lighting}

${composition}

${cameraAngle}

${expression}

${skinGrooming}

${quality}

${preservationRules}
`;

  if (state.operatorNote) {
    finalPrompt += `
Operator Notes:
${state.operatorNote}
`;
  }

  if (isRodor || state.preset === 'thai_student' || state.preset === 'thai_uniform') {
    finalPrompt += `
--- LOCK SYSTEM INSTRUCTIONS ---

FACE LOCK:
Preserve the exact facial identity from the reference image. Keep the same face shape, facial proportions, age impression, skin tone, eyes, nose, mouth, jawline, and natural expression. Do not beautify into a different person. Do not change bone structure. Do not make the face look younger, older, slimmer, wider, or more stylized.

INSIGNIA LOCK:
Preserve all visible uniform insignia, badges, patches, symbols, name marks, logos, and official-looking details exactly as shown in the reference image. Do not redesign, invent, remove, replace, translate, simplify, blur, or crop any insignia. Keep important uniform marks complete and clearly visible.

CROP SAFETY:
Generate a half-body official portrait with enough space around head, shoulders, chest, and upper uniform so the operator can crop manually into 1-inch ID photo size later. Do not crop too tight. Do not cut off shoulders. Do not cut off badges or insignia.

UNIFORM STRUCTURE:
Keep the uniform clean, crisp, straight, formal, and properly fitted. Remove wrinkles visually while preserving the original uniform design and marks. Keep shoulders level and posture straight.

SKIN CONTROL:
Natural skin tone only. Reduce oily shine. Avoid red face, overflushed cheeks, waxy skin, plastic skin, and over-smoothed texture.
`;
  }

  return {
    mainPrompt: finalPrompt.trim(),
    negativePrompt: negativePrompt.trim()
  };
};
