import React, { useState, useContext } from 'react';
import { Box, Typography, Button, Chip, LinearProgress, styled, keyframes } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { School, TravelExplore, AutoStories, Check } from '@mui/icons-material';

import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';
import { categories } from '../../constants/data';

// ---------- Animations ----------
const fadeSlideIn = keyframes`
  from { opacity: 0; transform: translateX(40px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const floatAnim = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;

// ---------- Styled Components ----------
const PageWrapper = styled(Box)`
  min-height: 100vh;
  background: linear-gradient(135deg, #03112B 0%, #0d2b5e 50%, #1a3a7a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(147, 175, 201, 0.15) 0%, transparent 70%);
    top: -150px;
    right: -150px;
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(147, 175, 201, 0.1) 0%, transparent 70%);
    bottom: -100px;
    left: -100px;
    border-radius: 50%;
  }
`;

const Card = styled(Box)`
  background: rgba(255, 255, 255, 0.97);
  border-radius: 24px;
  padding: 48px 44px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 1;

  @media (max-width: 600px) {
    padding: 32px 24px;
  }
`;

const StepContent = styled(Box)`
  animation: ${fadeSlideIn} 0.4s ease forwards;
`;

const IconHero = styled(Box)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #03112B, #1a3a7a);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  animation: ${floatAnim} 3s ease-in-out infinite;
  box-shadow: 0 8px 25px rgba(3, 17, 43, 0.35);
`;

const StepTitle = styled(Typography)`
  font-size: 1.9rem;
  font-weight: 800;
  color: #03112B;
  text-align: center;
  margin-bottom: 8px;

  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const StepSubtitle = styled(Typography)`
  font-size: 1rem;
  color: #666;
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.6;
`;

const ChipsGrid = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 32px;
`;

const CategoryChip = styled(Chip)`
  font-size: 0.9rem;
  font-weight: 600;
  padding: 6px 4px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.25s ease !important;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(3, 17, 43, 0.2);
  }
`;

const GoalChip = styled(Chip)`
  font-size: 0.95rem;
  font-weight: 600;
  padding: 20px 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease !important;
  flex: 1;
  min-width: 120px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(3, 17, 43, 0.2);
  }
`;

const ActionRow = styled(Box)`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const PrimaryBtn = styled(Button)`
  text-transform: none;
  background: linear-gradient(135deg, #03112B, #1a3a7a);
  color: #fff;
  height: 50px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  flex: 1;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #1a3a7a, #03112B);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(3, 17, 43, 0.4);
  }
`;

const SkipBtn = styled(Button)`
  text-transform: none;
  color: #999;
  height: 50px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0 20px;
  transition: all 0.3s ease;

  &:hover {
    color: #03112B;
    background: rgba(3, 17, 43, 0.06);
  }
`;

const ProgressContainer = styled(Box)`
  margin-bottom: 36px;
`;

const StepLabel = styled(Typography)`
  font-size: 0.82rem;
  color: #999;
  text-align: right;
  margin-bottom: 6px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const StyledLinearProgress = styled(LinearProgress)`
  height: 6px;
  border-radius: 6px;
  background-color: #e8e8e8;

  & .MuiLinearProgress-bar {
    background: linear-gradient(90deg, #93AFC9, #03112B);
    border-radius: 6px;
  }
`;

// ---------- Data ----------
const READING_GOALS = [
  { label: '🌿 Casual', value: 'casual', desc: 'A few posts a week' },
  { label: '📅 Daily',  value: 'daily',  desc: 'Read something every day' },
  { label: '🚀 Intensive', value: 'intensive', desc: 'Deep dives & long reads' },
];

// ---------- Component ----------
const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { account } = useContext(DataContext);

  const totalSteps = 3;
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  const toggleInterest = (cat) => {
    setSelectedInterests(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const finishOnboarding = async (skip = false) => {
    setLoading(true);
    try {
      await API.saveOnboarding({
        interests: skip ? [] : selectedInterests,
        readingGoal: skip ? '' : selectedGoal,
      });
    } catch (_) {
      // silent — onboarding is optional, don't block user
    }
    sessionStorage.setItem('onboardingCompleted', 'true');
    setLoading(false);
    navigate('/home');
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(s => s + 1);
    } else {
      finishOnboarding(false);
    }
  };

  const handleSkip = () => {
    if (step < totalSteps) {
      setStep(s => s + 1);
    } else {
      finishOnboarding(true);
    }
  };

  const firstName = account?.name?.split(' ')[0] || 'there';

  return (
    <PageWrapper>
      <Card>
        {/* Progress */}
        <ProgressContainer>
          <StepLabel>Step {step} of {totalSteps}</StepLabel>
          <StyledLinearProgress variant="determinate" value={progress} />
        </ProgressContainer>

        {/* ── STEP 1: Welcome ── */}
        {step === 1 && (
          <StepContent key="step1">
            <IconHero>
              <TravelExplore sx={{ color: '#fff', fontSize: 38 }} />
            </IconHero>
            <StepTitle>Welcome, {firstName}! 👋</StepTitle>
            <StepSubtitle>
              You're all set on EduVoyage — your space for knowledge,<br />
              discovery, and learning. Let's personalise your experience<br />
              so you see content you'll love. (It only takes 30 seconds!)
            </StepSubtitle>
            <ActionRow>
              <PrimaryBtn variant="contained" onClick={handleNext}>
                Let's Go →
              </PrimaryBtn>
              <SkipBtn onClick={() => finishOnboarding(true)}>
                Skip Setup
              </SkipBtn>
            </ActionRow>
          </StepContent>
        )}

        {/* ── STEP 2: Interests ── */}
        {step === 2 && (
          <StepContent key="step2">
            <IconHero>
              <School sx={{ color: '#fff', fontSize: 38 }} />
            </IconHero>
            <StepTitle>What topics excite you?</StepTitle>
            <StepSubtitle>
              Pick any categories you'd like to explore. You can always change this later.
            </StepSubtitle>

            <ChipsGrid>
              {categories.map(cat => {
                const isSelected = selectedInterests.includes(cat.type);
                return (
                  <CategoryChip
                    key={cat.id}
                    label={cat.type}
                    onClick={() => toggleInterest(cat.type)}
                    icon={isSelected ? <Check sx={{ fontSize: 16 }} /> : undefined}
                    sx={{
                      background: isSelected
                        ? 'linear-gradient(135deg, #03112B, #1a3a7a)'
                        : '#f0f4f8',
                      color: isSelected ? '#fff' : '#03112B',
                      border: isSelected
                        ? '2px solid transparent'
                        : '2px solid #dde4ec',
                    }}
                  />
                );
              })}
            </ChipsGrid>

            <ActionRow>
              <PrimaryBtn variant="contained" onClick={handleNext}>
                {selectedInterests.length > 0
                  ? `Continue (${selectedInterests.length} selected)`
                  : 'Continue'}
              </PrimaryBtn>
              <SkipBtn onClick={handleSkip}>Skip</SkipBtn>
            </ActionRow>
          </StepContent>
        )}

        {/* ── STEP 3: Reading Goal ── */}
        {step === 3 && (
          <StepContent key="step3">
            <IconHero>
              <AutoStories sx={{ color: '#fff', fontSize: 36 }} />
            </IconHero>
            <StepTitle>Your reading style?</StepTitle>
            <StepSubtitle>
              Help us tune the vibe. No pressure — pick what feels right today.
            </StepSubtitle>

            <ChipsGrid sx={{ mb: 4 }}>
              {READING_GOALS.map(g => {
                const isSelected = selectedGoal === g.value;
                return (
                  <GoalChip
                    key={g.value}
                    label={
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                          {g.label}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
                          {g.desc}
                        </Typography>
                      </Box>
                    }
                    onClick={() => setSelectedGoal(g.value)}
                    sx={{
                      height: 'auto',
                      background: isSelected
                        ? 'linear-gradient(135deg, #03112B, #1a3a7a)'
                        : '#f0f4f8',
                      color: isSelected ? '#fff' : '#03112B',
                      border: isSelected
                        ? '2px solid transparent'
                        : '2px solid #dde4ec',
                      '& .MuiChip-label': { width: '100%' }
                    }}
                  />
                );
              })}
            </ChipsGrid>

            <ActionRow>
              <PrimaryBtn
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? 'Saving...' : '🚀 Start Exploring'}
              </PrimaryBtn>
              <SkipBtn onClick={() => finishOnboarding(true)} disabled={loading}>
                Skip
              </SkipBtn>
            </ActionRow>
          </StepContent>
        )}
      </Card>
    </PageWrapper>
  );
};

export default Onboarding;
