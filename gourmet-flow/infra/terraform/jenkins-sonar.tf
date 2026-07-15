data "aws_vpc" "jenkins_sonar" {
  filter {
    name   = "tag:Name"
    values = ["jenkins-sonar-vpc-vpc"]
  }
}

data "aws_security_group" "jenkins_sonar" {
  name   = "jenkins-sonar-sg"
  vpc_id = data.aws_vpc.jenkins_sonar.id
}

data "aws_subnets" "jenkins_sonar" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.jenkins_sonar.id]
  }
}

data "aws_iam_user" "lekym" {
  user_name = "Lekym"
}

resource "aws_iam_role" "jenkins" {
  name = "${var.app_name}-${var.environment}-jenkins-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "jenkins_ssm" {
  role       = aws_iam_role.jenkins.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "jenkins" {
  name = "${var.app_name}-${var.environment}-jenkins-profile"
  role = aws_iam_role.jenkins.name
}

resource "aws_instance" "jenkins" {
  ami                    = var.ubuntu_ami_id
  instance_type          = var.jenkins_instance_type
  subnet_id              = data.aws_subnets.jenkins_sonar.ids[0]
  vpc_security_group_ids = [data.aws_security_group.jenkins_sonar.id]
  key_name               = var.ssh_key_name
  iam_instance_profile   = aws_iam_instance_profile.jenkins.name

  root_block_device {
    volume_type = "gp3"
    volume_size = var.jenkins_root_volume_size
    encrypted   = true
  }

  tags = {
    Name = "jenkins-server"
  }
}

resource "aws_eip" "jenkins" {
  instance = aws_instance.jenkins.id
  domain   = "vpc"

  tags = {
    Name = "${var.app_name}-${var.environment}-jenkins-eip"
  }
}

