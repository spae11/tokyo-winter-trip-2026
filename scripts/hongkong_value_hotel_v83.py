from pathlib import Path

# Idempotent correction pass for Hong Kong v83.
p=Path('trip-tools-v1.js')
s=p.read_text()
s=s.replace("['18:00','กลับ Jordan','Tsim Sha Tsui Station']","['18:00','กลับ Jordan','Jordan Station Hong Kong']")
s=s.replace("value=\"${Number(state.budgets.hongkong)||55000}\"","value=\"${Number(state.budgets.hongkong)||70000}\"")
s=s.replace("state.budgets.hongkong=Number($('#ttHKBudget',p).value)||55000","state.budgets.hongkong=Number($('#ttHKBudget',p).value)||70000")
s=s.replace("state.budgets=Object.assign({tokyo:65000,hongkong:55000,danang:45000}","state.budgets=Object.assign({tokyo:65000,hongkong:70000,danang:45000}")
p.write_text(s)

p=Path('hongkong/index.html')
s=p.read_text()
s=s.replace("['18:00','กลับ Jordan','Tsim Sha Tsui Station']","['18:00','กลับ Jordan','Jordan Station Hong Kong']")
p.write_text(s)
