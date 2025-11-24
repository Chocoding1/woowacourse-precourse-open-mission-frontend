# AI ChatBot FrontEnd

# 주요 기능
## 1. 사용자 인증
### [회원가입]
- 사용자는 이메일, 비밀번호를 이용해 회원가입할 수 있습니다.
  - 사용자는 이메일 인증을 해야 로그인할 수 있습니다.
### [로그인]
- 사용자는 가입 시 사용한 이메일, 비밀번호를 이용해 로그인할 수 있습니다.
## 2. 채팅 기능
### [채팅]
- 사용자는 텍스트를 입력하여 전송하고, AI의 응답을 받을 수 있습니다.
- 인증된 사용자의 경우, 대화 진행 시, 새로운 채팅방이 생성되어 화면 좌측에 표시됩니다.
### [채팅 저장]
- 인증된 사용자의 경우, 대화한 기록은 저장됩니다.
### [채팅방 조회]
- 사용자는 이전 채팅방을 조회할 수 있고, 해당 채팅방에서 나눈 대화 기록을 조회할 수 있습니다.

# 화면 설계
## 채팅 화면
- **홈화면**으로써, **채팅 화면**, **회원가입 & 로그인 버튼**, **이전 대화 목록**, **로그아웃 버튼**이 존재합니다.
  ### [채팅 화면]
  - 화면 중앙에 위치하며, 채팅 입력칸이 존재하고, 입력한 채팅과 답변은 화면에 표시됩니다.
  ### [회원가입, 로그인 버튼]
  - 홈화면의 우측 상단에 위치합니다.
  ### [이전 대화 목록]
  - 홈화면 좌측에 존재합니다.
  ### [로그아웃 버튼]
  - 로그인 시에만 생성되며, 홈화면의 우측 상단에 위치합니다.
  ### [채팅방 목록]
  - 로그인 시에만 생성되며, 홈화면의 좌측에 위치합니다.
## 회원가입 화면
- **이메일 입력칸**, **비밀번호 입력칸**, **회원가입 버튼**이 존재합니다.
  ### [이메일 입력칸]
  - 이메일 입력칸 옆에 인증 버튼이 있고, 인증 버튼을 누르면 해당 이메일로 인증코드가 전송됩니다.
  ### [이메일 인증코드 입력칸]
  - 이메일 인증코드 전송버튼을 누르면 인증번호 입력칸이 화면에 나타납니다.
  ### [비밀번호 입력칸]
  - 비밀번호 입력칸과 비밀번호 재입력칸이 존재합니다.
## 로그인 화면
- **이메일 입력칸**, **비밀번호 입력칸**, **로그인 버튼**, **회원가입 버튼**이 존재합니다.

---
# 실제 화면
## 홈화면(로그인 X)
<img width="1916" height="953" alt="Image" src="https://github.com/user-attachments/assets/a837960e-40dc-4628-b845-b5f0ae1f07ac" />

## 홈화면(로그인 O)
<img width="1918" height="947" alt="Image" src="https://github.com/user-attachments/assets/33314ce3-080c-4344-9752-398cce0253e1" />

## 로그인 화면
<img width="1917" height="951" alt="Image" src="https://github.com/user-attachments/assets/d7ddacc2-b1d9-4322-9427-3902d88e23c0" />

## 회원가입 화면
<img width="1917" height="943" alt="Image" src="https://github.com/user-attachments/assets/d218b7ba-7791-4a2f-baf8-33ca123bced8" />

## 회원가입 화면(이메일 인증코드 전송 후)
<img width="1918" height="952" alt="Image" src="https://github.com/user-attachments/assets/4bc139b3-f0c5-4865-9135-e2bfee04496a" />

## 채팅 화면(로그인 X)
<img width="1916" height="950" alt="Image" src="https://github.com/user-attachments/assets/6a69192b-c59b-4971-a6ff-c6e926fda43e" />

## 채팅 화면(로그인 O)
<img width="1918" height="949" alt="Image" src="https://github.com/user-attachments/assets/4ba2de3a-01f1-495a-bf95-b80691963940" />

## 채팅 화면(로그인 O + 새로운 채팅)
<img width="1919" height="949" alt="Image" src="https://github.com/user-attachments/assets/ed62fdae-22df-4566-9f32-91b95e83fdec" />
