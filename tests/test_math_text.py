import unittest, importlib.util
from pathlib import Path
spec=importlib.util.spec_from_file_location('import_pdf_bank',Path(__file__).parents[1]/'scripts/import_pdf_bank.py')
bank=importlib.util.module_from_spec(spec);spec.loader.exec_module(bank)
class StemExtraction(unittest.TestCase):
 def test_answer_and_rationale_are_excluded(self):
  text='Question ID abc12345\nID: abc12345\nWhat is the median?\nA. 2\nB. 4\nID: abc12345 Answer\nCorrect Answer:\nB\nRationale\nA private worked solution'
  self.assertEqual(bank.math_question_text(text,'abc12345'),'What is the median? A. 2 B. 4')
 def test_missing_answer_heading_still_stops_before_key(self):
  self.assertEqual(bank.math_question_text('Question ID abc12345\nA circle has radius 3.\nCorrect Answer:\n6','abc12345'),'A circle has radius 3.')
 def test_equation_whitespace_and_source_id(self):
  result=bank.math_question_text('Question ID abc12345\nID: abc12345\ny = 2x + 1\nWhat is y when x=3?','abc12345')
  self.assertIn('y = 2x + 1',result);self.assertNotIn('abc12345',result)
if __name__=='__main__':unittest.main()
