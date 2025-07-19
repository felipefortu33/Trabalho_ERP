// src/utils/globalStyles.js
import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from './colors';

export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.md,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  
  // Card styles
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.sm,
  },
  cardLarge: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
    ...shadows.md,
  },
  
  // Text styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    color: colors.textTertiary,
    lineHeight: 18,
  },
  
  // Layout styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  flex1: {
    flex: 1,
  },
  
  // Margin and padding utilities
  mt_xs: { marginTop: spacing.xs },
  mt_sm: { marginTop: spacing.sm },
  mt_md: { marginTop: spacing.md },
  mt_lg: { marginTop: spacing.lg },
  mt_xl: { marginTop: spacing.xl },
  
  mb_xs: { marginBottom: spacing.xs },
  mb_sm: { marginBottom: spacing.sm },
  mb_md: { marginBottom: spacing.md },
  mb_lg: { marginBottom: spacing.lg },
  mb_xl: { marginBottom: spacing.xl },
  
  ml_xs: { marginLeft: spacing.xs },
  ml_sm: { marginLeft: spacing.sm },
  ml_md: { marginLeft: spacing.md },
  ml_lg: { marginLeft: spacing.lg },
  
  mr_xs: { marginRight: spacing.xs },
  mr_sm: { marginRight: spacing.sm },
  mr_md: { marginRight: spacing.md },
  mr_lg: { marginRight: spacing.lg },
  
  p_xs: { padding: spacing.xs },
  p_sm: { padding: spacing.sm },
  p_md: { padding: spacing.md },
  p_lg: { padding: spacing.lg },
  p_xl: { padding: spacing.xl },
  
  px_xs: { paddingHorizontal: spacing.xs },
  px_sm: { paddingHorizontal: spacing.sm },
  px_md: { paddingHorizontal: spacing.md },
  px_lg: { paddingHorizontal: spacing.lg },
  
  py_xs: { paddingVertical: spacing.xs },
  py_sm: { paddingVertical: spacing.sm },
  py_md: { paddingVertical: spacing.md },
  py_lg: { paddingVertical: spacing.lg },
  
  // Alignment utilities
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  
  itemsCenter: { alignItems: 'center' },
  itemsStart: { alignItems: 'flex-start' },
  itemsEnd: { alignItems: 'flex-end' },
  
  justifyCenter: { justifyContent: 'center' },
  justifyStart: { justifyContent: 'flex-start' },
  justifyEnd: { justifyContent: 'flex-end' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyAround: { justifyContent: 'space-around' },
  
  // Border utilities
  borderRadius_sm: { borderRadius: borderRadius.sm },
  borderRadius_md: { borderRadius: borderRadius.md },
  borderRadius_lg: { borderRadius: borderRadius.lg },
  borderRadius_xl: { borderRadius: borderRadius.xl },
  borderRadius_full: { borderRadius: borderRadius.full },
  
  // Shadow utilities
  shadow_sm: shadows.sm,
  shadow_md: shadows.md,
  shadow_lg: shadows.lg,
  
  // Color utilities
  bgPrimary: { backgroundColor: colors.primary },
  bgSecondary: { backgroundColor: colors.secondary },
  bgSurface: { backgroundColor: colors.surface },
  bgBackground: { backgroundColor: colors.background },
  
  textPrimary: { color: colors.textPrimary },
  textSecondary: { color: colors.textSecondary },
  textTertiary: { color: colors.textTertiary },
  textWhite: { color: colors.textWhite },
  textSuccess: { color: colors.success },
  textWarning: { color: colors.warning },
  textError: { color: colors.error },
  textInfo: { color: colors.info },
});
